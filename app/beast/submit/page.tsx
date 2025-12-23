'use client';

import { useState, useRef } from 'react';
import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  validateBeastSubmission,
  storeVideoHash,
  formatFileSize,
  formatDuration,
  getValidationSummary,
  type ValidationResult
} from '@/lib/videoValidation';
import VideoRecorder from '@/components/VideoRecorder';

export default function BeastSubmitPage() {
  const router = useRouter();
  const { currentWeek, currentPhase, hasSubmitted, submitVideo } = useBeastWeekCycle();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentWeek) {
    return <div className="min-h-screen bg-nightfall flex items-center justify-center"><p className="text-steel">Loading...</p></div>;
  }

  if (currentPhase !== 'SUBMISSIONS_OPEN') {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-black text-ash">Submissions Closed</h1>
          <p className="text-steel">Submissions are only open Tuesday-Wednesday.</p>
          <Link href="/"><button className="px-6 py-3 rounded-xl bg-digital-grape text-ash font-bold hover:scale-105 transition-transform">Back to Feed</button></Link>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-black text-ash">Submitted!</h1>
          <p className="text-steel">Voting opens Thursday!</p>
          <Link href="/"><button className="px-6 py-3 rounded-xl bg-signal-lime text-nightfall font-bold hover:scale-105 transition-transform">Back to Feed</button></Link>
        </div>
      </div>
    );
  }

  const handleRecordingComplete = async (videoBlob: Blob, videoUrl: string) => {
    setShowRecorder(false);

    // Convert Blob to File
    const file = new File([videoBlob], `beast-${Date.now()}.webm`, { type: 'video/webm' });

    // Set preview immediately for UX
    setVideoFile(file);
    setVideoPreview(videoUrl);
    setIsValidating(true);

    // Run validation
    try {
      const result = await validateBeastSubmission(
        file,
        currentWeek.id,
        currentWeek.maxDuration
      );
      setValidationResult(result);

      // Auto-submit if valid
      if (result.valid && result.metadata?.hash) {
        storeVideoHash(result.metadata.hash, currentWeek.id);

        const reader = new FileReader();
        reader.onloadend = () => {
          submitVideo({
            videoUrl: reader.result as string,
            caption: caption.trim() || `Week ${currentWeek.weekNumber} - ${currentWeek.theme}`,
            duration: result.metadata?.duration || currentWeek.maxDuration
          });
          router.push('/');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        valid: false,
        errors: ['Failed to validate video. Please try again.'],
        warnings: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Set preview immediately for UX
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setIsValidating(true);

    // Run validation
    try {
      const result = await validateBeastSubmission(
        file,
        currentWeek.id,
        currentWeek.maxDuration
      );
      setValidationResult(result);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResult({
        valid: false,
        errors: ['Failed to validate video. Please try again.'],
        warnings: []
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = () => {
    if (!videoFile || !caption.trim()) {
      alert('Please add video and caption');
      return;
    }

    // Check validation result
    if (!validationResult || !validationResult.valid) {
      alert('Please fix validation errors before submitting');
      return;
    }

    // Store video hash to prevent duplicate submissions
    if (validationResult.metadata?.hash) {
      storeVideoHash(validationResult.metadata.hash, currentWeek.id);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      submitVideo({
        videoUrl: reader.result as string,
        caption: caption.trim(),
        duration: validationResult.metadata?.duration || 30
      });
      router.push('/');
    };
    reader.readAsDataURL(videoFile);
  };

  // Show Video Recorder
  if (showRecorder) {
    return (
      <VideoRecorder
        maxDuration={currentWeek.maxDuration}
        onRecordingComplete={handleRecordingComplete}
        onCancel={() => setShowRecorder(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-nightfall pb-20">
      <div className="sticky top-0 z-10 bg-nightfall/95 backdrop-blur-lg border-b border-steel/20">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-steel hover:text-ash transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-black text-ash">Submit Beast Video</h1>
          <button
            onClick={handleSubmit}
            disabled={!videoFile || !caption.trim() || !validationResult?.valid || isValidating}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              videoFile && caption.trim() && validationResult?.valid && !isValidating
                ? 'bg-signal-lime text-nightfall hover:scale-105'
                : 'bg-carbon/50 text-steel/50 cursor-not-allowed'
            }`}
          >
            {isValidating ? 'Validating...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-digital-grape/20 to-brand-mocha/20 border border-digital-grape/40 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎬</span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ash mb-1">{currentWeek.title}</h2>
              <p className="text-sm text-steel mb-3">{currentWeek.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-signal-lime">PRIZE:</span>
                <span className="text-sm font-bold text-ash">{currentWeek.prize.displayString}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-steel">Rules:</p>
                {currentWeek.rules.map((rule, i) => (<p key={i} className="text-xs text-steel/70">• {rule}</p>))}
              </div>
            </div>
          </div>
        </div>

        {!videoPreview ? (
          <div className="space-y-3">
            {/* PRIMARY CTA - Record Video */}
            <button
              onClick={() => setShowRecorder(true)}
              className="w-full bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-lg px-8 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3 shadow-elevated"
            >
              <span className="text-3xl">🎥</span>
              <span>Record Video Now</span>
            </button>

            {/* SECONDARY CTA - Upload */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-steel/20"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-nightfall text-steel font-semibold">OR</span>
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-carbon border-2 border-steel/20 text-ash font-semibold text-base px-6 py-4 rounded-2xl hover:border-ash/40 transition-colors flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📂</span>
              <span>Upload Existing Video</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-carbon">
              <video src={videoPreview} controls className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => {
                setVideoFile(null);
                setVideoPreview(null);
                setValidationResult(null);
                setIsValidating(false);
              }}
              className="w-full px-4 py-3 rounded-xl bg-carbon border border-steel/20 text-steel font-semibold hover:border-ash transition-colors"
            >
              Change Video
            </button>
          </div>
        )}

        {videoPreview && (
          <>
            {/* Validation Results */}
            {isValidating && (
              <div className="bg-carbon border border-digital-grape/40 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-signal-lime border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-ash">Validating video...</p>
                </div>
              </div>
            )}

            {validationResult && !isValidating && (
              <div className={`border rounded-2xl p-4 ${
                validationResult.valid
                  ? 'bg-signal-lime/10 border-signal-lime/40'
                  : 'bg-electric-coral/10 border-electric-coral/40'
              }`}>
                {/* Validation Summary */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{validationResult.valid ? '✅' : '❌'}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${
                      validationResult.valid ? 'text-signal-lime' : 'text-electric-coral'
                    }`}>
                      {getValidationSummary(validationResult)}
                    </p>
                    {validationResult.metadata && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-steel">
                          Duration: {formatDuration(validationResult.metadata.duration)} / {currentWeek.maxDuration}s
                        </p>
                        <p className="text-xs text-steel">
                          Size: {formatFileSize(validationResult.metadata.fileSize)} / 100MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Errors */}
                {validationResult.errors.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {validationResult.errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 bg-electric-coral/20 rounded-lg p-3">
                        <span className="text-electric-coral text-sm">⚠️</span>
                        <p className="text-xs text-ash leading-relaxed flex-1">{error}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-steel">Suggestions:</p>
                    {validationResult.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2 bg-steel/10 rounded-lg p-3">
                        <span className="text-steel text-sm">💡</span>
                        <p className="text-xs text-steel/80 leading-relaxed flex-1">{warning}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-ash">Caption</label>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe your submission..." maxLength={200} className="w-full px-4 py-3 rounded-xl bg-carbon border border-steel/20 text-ash placeholder-steel/50 resize-none focus:border-signal-lime focus:outline-none transition-colors" rows={3} />
              <p className="text-xs text-steel text-right">{caption.length}/200</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
