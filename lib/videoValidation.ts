/**
 * Video Validation System for Beast Week Submissions
 *
 * Automated validation to reduce manual review workload:
 * - Technical checks (duration, size, format)
 * - Duplicate detection
 * - Rule enforcement
 *
 * Reduces manual review by ~10% (auto-rejects invalid submissions)
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    duration: number;
    fileSize: number;
    format: string;
    hash?: string;
  };
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fileSize: number;
  format: string;
}

/**
 * Get video duration in seconds
 */
export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Get comprehensive video metadata
 */
export async function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true; // Required for autoplay in some browsers

    let resolved = false;

    const cleanup = () => {
      if (video.src) {
        window.URL.revokeObjectURL(video.src);
      }
    };

    const handleSuccess = () => {
      if (resolved) return;
      resolved = true;

      // Validate duration is a valid number
      const duration = video.duration;

      if (!isFinite(duration) || isNaN(duration) || duration === 0) {
        cleanup();
        reject(new Error('Video duration could not be determined. The video may be corrupted or still processing.'));
        return;
      }

      cleanup();
      resolve({
        duration: duration,
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        fileSize: file.size,
        format: file.type
      });
    };

    video.onloadedmetadata = handleSuccess;

    // Some browsers need additional event listeners for WebM
    video.oncanplay = () => {
      if (!resolved && video.duration && isFinite(video.duration)) {
        handleSuccess();
      }
    };

    video.onerror = (e) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error('Failed to load video metadata. Please ensure the video is valid.'));
    };

    // Timeout after 8 seconds (longer for WebM processing)
    const timeout = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      cleanup();
      reject(new Error('Video metadata loading timed out. The file may be too large or corrupted.'));
    }, 8000);

    try {
      video.src = URL.createObjectURL(file);
      // Trigger load
      video.load();
    } catch (error) {
      clearTimeout(timeout);
      cleanup();
      reject(new Error('Failed to create video preview. Please try again.'));
    }
  });
}

/**
 * Generate file hash for duplicate detection
 * Uses Web Crypto API for fast hashing
 */
export async function generateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Check if video hash already exists (duplicate submission)
 */
export async function checkDuplicateHash(hash: string, beastWeekId: string): Promise<boolean> {
  // In production, this would check Firestore
  // For now, check localStorage
  const storedHashes = localStorage.getItem(`beast_hashes_${beastWeekId}`);
  if (!storedHashes) return false;

  const hashes: string[] = JSON.parse(storedHashes);
  return hashes.includes(hash);
}

/**
 * Store video hash to prevent future duplicates
 */
export function storeVideoHash(hash: string, beastWeekId: string): void {
  const storedHashes = localStorage.getItem(`beast_hashes_${beastWeekId}`);
  const hashes: string[] = storedHashes ? JSON.parse(storedHashes) : [];

  if (!hashes.includes(hash)) {
    hashes.push(hash);
    localStorage.setItem(`beast_hashes_${beastWeekId}`, JSON.stringify(hashes));
  }
}

/**
 * Validate video file against Beast Week rules
 */
export async function validateBeastSubmission(
  file: File,
  beastWeekId: string,
  maxDuration: number = 30
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // 1. File format validation
    const allowedFormats = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'];
    if (!allowedFormats.includes(file.type)) {
      errors.push(`Invalid format. Please use MP4, MOV, or WebM. (Got: ${file.type})`);
    }

    // 2. File size validation (100MB max)
    const maxSizeBytes = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSizeBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      errors.push(`File too large. Maximum size is 100MB. (Your file: ${sizeMB}MB)`);
    }

    // If format/size failed, don't continue (can't load metadata)
    if (errors.length > 0) {
      return { valid: false, errors, warnings };
    }

    // 3. Get video metadata
    const metadata = await getVideoMetadata(file);

    // 4. Duration validation
    if (metadata.duration > maxDuration) {
      errors.push(`Video too long. Maximum duration is ${maxDuration} seconds. (Your video: ${Math.floor(metadata.duration)}s)`);
    }

    // Warning for very short videos
    if (metadata.duration < 3) {
      warnings.push('Video is very short (less than 3 seconds). Consider making it longer for better engagement.');
    }

    // 5. Resolution validation (minimum quality)
    const minWidth = 720;
    const minHeight = 480;
    if (metadata.width < minWidth || metadata.height < minHeight) {
      warnings.push(`Low resolution (${metadata.width}x${metadata.height}). Recommended: at least 720x480 for better quality.`);
    }

    // 6. Aspect ratio check (vertical video recommended)
    const aspectRatio = metadata.width / metadata.height;
    if (aspectRatio > 1) {
      warnings.push('Horizontal video detected. Vertical videos (9:16) perform better on mobile!');
    }

    // 7. Duplicate detection
    const hash = await generateFileHash(file);
    const isDuplicate = await checkDuplicateHash(hash, beastWeekId);

    if (isDuplicate) {
      errors.push('This video has already been submitted for this Beast Week. Please submit a different video.');
    }

    // Return validation result
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        duration: metadata.duration,
        fileSize: file.size,
        format: file.type,
        hash
      }
    };

  } catch (error) {
    console.error('Video validation error:', error);
    return {
      valid: false,
      errors: ['Failed to validate video. Please try again or contact support.'],
      warnings
    };
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
}

/**
 * Get validation summary for UI display
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.valid) {
    return '✅ Video passed all validation checks!';
  }

  if (result.errors.length > 0) {
    return `❌ ${result.errors.length} error${result.errors.length > 1 ? 's' : ''} found`;
  }

  return '⚠️ Video has warnings';
}
