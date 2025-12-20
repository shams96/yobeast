'use client';

import { useState, useRef, useEffect } from 'react';
import { MOCK_BEAST_WEEK } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useReals } from '@/context/RealsContext';

type MomentType = 'moment' | 'beast_moment';
type CaptureMode = 'photo' | 'video';

export default function NewMomentPage() {
  const [momentType, setMomentType] = useState<MomentType>('beast_moment');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [allowInBeastReel, setAllowInBeastReel] = useState(true);
  const [captureMode, setCaptureMode] = useState<CaptureMode>('photo');

  const router = useRouter();
  const { realsTime, markAsPosted } = useReals();
  const beastWeek = MOCK_BEAST_WEEK;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) {
        URL.revokeObjectURL(mediaPreviewUrl);
      }
    };
  }, [mediaPreviewUrl]);

  const handleVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });

      // Create video element for preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.playsInline = true;
      video.muted = true;
      await video.play();

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `beast-${Date.now()}.webm`, { type: 'video/webm' });
        const url = URL.createObjectURL(file);
        setMediaFile(file);
        setMediaPreviewUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();

      // Stop after 30 seconds (Beast Week max duration)
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 30000);

      // Allow manual stop before 30 seconds
      alert('Recording started! Will auto-stop after 30 seconds. Click OK to stop early.');
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    } catch (error) {
      console.error('Video recording error:', error);
      alert(`Camera error: ${error instanceof Error ? error.message : 'Permission denied. Please allow camera access.'}`);
      // Fallback to file input
      fileInputRef.current?.click();
    }
  };

  const handleCameraCapture = async (mode: CaptureMode) => {
    if (mode === 'video') {
      await handleVideoRecording();
      return;
    }

    try {
      // DUAL CAMERA CAPTURE - 4Real's core authenticity mechanic
      // Simultaneously capture front and back cameras

      // Request back camera (main environment view)
      const backStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });

      // Request front camera (selfie view)
      const frontStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });

      // Create video elements for both cameras
      const backVideo = document.createElement('video');
      backVideo.srcObject = backStream;
      backVideo.playsInline = true;
      backVideo.muted = true;

      const frontVideo = document.createElement('video');
      frontVideo.srcObject = frontStream;
      frontVideo.playsInline = true;
      frontVideo.muted = true;

      // Play both videos
      await backVideo.play();
      await frontVideo.play();

      // Wait for both videos to be ready
      await Promise.all([
        new Promise<void>((resolve) => {
          if (backVideo.readyState >= backVideo.HAVE_ENOUGH_DATA) {
            resolve();
          } else {
            backVideo.onloadeddata = () => resolve();
          }
        }),
        new Promise<void>((resolve) => {
          if (frontVideo.readyState >= frontVideo.HAVE_ENOUGH_DATA) {
            resolve();
          } else {
            frontVideo.onloadeddata = () => resolve();
          }
        })
      ]);

      // Create composite canvas with dual camera view
      const canvas = document.createElement('canvas');
      canvas.width = backVideo.videoWidth;
      canvas.height = backVideo.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      // Draw back camera (main view) - full canvas
      ctx.drawImage(backVideo, 0, 0, canvas.width, canvas.height);

      // Draw front camera (selfie) in top-left corner with rounded border
      // 4Real style: small circular overlay
      const frontSize = Math.min(canvas.width, canvas.height) * 0.25; // 25% of canvas size
      const frontX = canvas.width * 0.05; // 5% from left
      const frontY = canvas.height * 0.05; // 5% from top
      const radius = frontSize / 2;

      // Save context state
      ctx.save();

      // Create circular clipping path for front camera
      ctx.beginPath();
      ctx.arc(frontX + radius, frontY + radius, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw front camera image (mirrored like selfie)
      ctx.translate(frontX + frontSize, frontY);
      ctx.scale(-1, 1);
      ctx.drawImage(frontVideo, 0, 0, frontSize, frontSize);

      // Restore context
      ctx.restore();

      // Add white border around front camera circle (4Real signature style)
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(frontX + radius, frontY + radius, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Convert composite to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `4real-moment-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const url = URL.createObjectURL(file);
          setMediaFile(file);
          setMediaPreviewUrl(url);
        }

        // Clean up both streams
        backStream.getTracks().forEach((track) => track.stop());
        frontStream.getTracks().forEach((track) => track.stop());
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Dual camera capture error:', error);

      // Fallback to single camera if dual camera fails
      try {
        console.log('Falling back to single front camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1920 } },
          audio: false,
        });

        const video = document.createElement('video');
        video.srcObject = stream;
        video.playsInline = true;
        video.muted = true;
        await video.play();

        await new Promise<void>((resolve) => {
          if (video.readyState >= video.HAVE_ENOUGH_DATA) {
            resolve();
          } else {
            video.onloadeddata = () => resolve();
          }
        });

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `moment-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const url = URL.createObjectURL(file);
            setMediaFile(file);
            setMediaPreviewUrl(url);
          }
          stream.getTracks().forEach((track) => track.stop());
        }, 'image/jpeg', 0.95);
      } catch (fallbackError) {
        console.error('Fallback camera error:', fallbackError);
        alert(`Camera error: ${fallbackError instanceof Error ? fallbackError.message : 'Permission denied. Please allow camera access.'}`);
        // Final fallback to file input
        fileInputRef.current?.click();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!mediaFile) return;

    try {
      // Convert file to base64 for localStorage
      const reader = new FileReader();
      reader.readAsDataURL(mediaFile);

      await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      const mediaDataUrl = reader.result as string;

      // Get current user from localStorage
      const userStr = localStorage.getItem('yollr_user');
      const user = userStr ? JSON.parse(userStr) : null;

      // Check if posting late (outside 4Real window)
      const wasLate = !realsTime.isActive && !realsTime.hasPostedToday;

      // Create moment object
      const newMoment = {
        id: `moment_${Date.now()}`,
        userId: user?.id || 'demo_user_001',
        caption,
        mediaUrl: mediaDataUrl,
        mediaType: mediaFile.type.startsWith('image/') ? 'image' : 'video',
        isBeastMoment: momentType === 'beast_moment',
        beastWeekId: momentType === 'beast_moment' ? beastWeek.id : undefined,
        allowInBeastReel: momentType === 'beast_moment' && allowInBeastReel,
        reactionsCount: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isLate: wasLate, // 4Real late posting indicator
        user: user || {
          id: 'demo_user_001',
          name: 'Demo Student',
          username: 'demo_student',
          campus: 'Demo University',
        }
      };

      // Get existing moments from localStorage
      const momentsStr = localStorage.getItem('yollr_moments');
      const moments = momentsStr ? JSON.parse(momentsStr) : [];

      // Add new moment to the beginning
      moments.unshift(newMoment);

      // Save back to localStorage
      localStorage.setItem('yollr_moments', JSON.stringify(moments));

      // Mark as posted in 4Real context (unlocks feed viewing)
      markAsPosted(wasLate);

      console.log('✅ Moment posted successfully!', newMoment);

      // Show success message with late warning
      if (wasLate) {
        alert('🎉 Your moment has been posted!\n⏰ Posted late - but that\'s okay!');
      } else {
        alert('🎉 Your moment has been posted on time!');
      }

      // Navigate back to feed
      router.push('/');
    } catch (error) {
      console.error('Failed to post moment:', error);
      alert('❌ Failed to post moment. Please try again.');
    }
  };

  const isImage = mediaFile?.type.startsWith('image/');
  const isVideo = mediaFile?.type.startsWith('video/');

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-dark-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <h1 className="text-lg font-bold text-text-primary">
            New Moment
          </h1>

          <button
            onClick={handlePost}
            disabled={!mediaFile}
            className="text-accent-fire font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 p-1 bg-dark-surface rounded-xl">
            <button
              onClick={() => setMomentType('moment')}
              className={`
                flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${momentType === 'moment'
                  ? 'bg-dark-elevated text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
                }
              `}
            >
              Moment
            </button>
            <button
              onClick={() => setMomentType('beast_moment')}
              className={`
                flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                ${momentType === 'beast_moment'
                  ? 'bg-gradient-to-r from-accent-fire to-brand-pink text-white'
                  : 'text-text-tertiary hover:text-text-secondary'
                }
              `}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span>🔥</span>
                <span>Beast Moment</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Media Capture/Upload */}
        {!mediaFile ? (
          <div className="space-y-4">
            {/* Camera Capture Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleCameraCapture('photo')}
                className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-brand-purple to-brand-mocha hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    Take Photo
                  </p>
                  <p className="text-xs text-white/70">
                    Capture now
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleCameraCapture('video')}
                className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-accent-fire to-brand-pink hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center gap-3"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">
                    Record Video
                  </p>
                  <p className="text-xs text-white/70">
                    Quick clip
                  </p>
                </div>
              </button>
            </div>

            {/* Hidden File Input (Fallback) */}
            <input
              ref={fileInputRef}
              type="file"
              accept={captureMode === 'photo' ? 'image/*' : 'video/*'}
              capture={captureMode === 'photo' ? 'user' : 'user'}
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Or Upload from Gallery */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dark-bg px-2 text-text-tertiary">or</span>
              </div>
            </div>

            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="p-4 rounded-xl bg-dark-surface border border-dark-border hover:border-brand-mocha transition-colors flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-text-secondary">
                  Choose from Gallery
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Media Preview */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-dark-surface">
              {isImage && (
                <img
                  src={mediaPreviewUrl}
                  alt="Moment preview"
                  className="w-full h-full object-cover"
                />
              )}
              {isVideo && (
                <video
                  src={mediaPreviewUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}

              {/* Change Media Button */}
              <label className="absolute bottom-4 right-4 cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="glass-elevated px-4 py-2 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform active:scale-95">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Change</span>
                </div>
              </label>
            </div>

            {/* Caption Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">
                Add a caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={
                  momentType === 'beast_moment'
                    ? "Share what you're working on for this week's Beast..."
                    : "What's happening on campus?"
                }
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-dark-surface text-text-primary
                  border border-dark-border focus:border-brand-mocha
                  placeholder:text-text-tertiary
                  resize-none h-24
                  transition-colors outline-none
                "
                maxLength={200}
              />
              <div className="flex justify-end">
                <span className="text-xs text-text-tertiary">
                  {caption.length}/200
                </span>
              </div>
            </div>

            {/* Beast Moment Options */}
            {momentType === 'beast_moment' && (
              <div className="space-y-4">
                {/* Beast Week Badge */}
                <div className="glass-elevated p-4 rounded-xl flex items-center gap-3">
                  <span className="text-2xl">🔥</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      Tagged to: {beastWeek.title}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      Week {beastWeek.weekNumber}
                    </p>
                  </div>
                </div>

                {/* Beast Reel Permission */}
                <div className="flex items-center justify-between p-4 glass-elevated rounded-xl">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      Allow in Beast Reel?
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      Your Moment may be featured in this week's Beast Reel
                    </p>
                  </div>
                  <button
                    onClick={() => setAllowInBeastReel(!allowInBeastReel)}
                    className={`
                      relative w-12 h-7 rounded-full transition-colors
                      ${allowInBeastReel ? 'bg-accent-fire' : 'bg-dark-border'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 w-5 h-5 rounded-full bg-white shadow-md
                        transition-transform duration-200
                        ${allowInBeastReel ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Expiration Note */}
            <div className="glass-elevated p-3 rounded-xl">
              <p className="text-xs text-text-tertiary leading-relaxed">
                ⏰ This Moment will disappear in 24 hours. {momentType === 'beast_moment' && 'Beast Moments may be saved to the Beast Reel.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
