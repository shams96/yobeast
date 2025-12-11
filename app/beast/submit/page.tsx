'use client';

import { useState, useRef, useEffect } from 'react';
import { MOCK_BEAST_WEEK } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BeastSubmitPage() {
  const [step, setStep] = useState<'brief' | 'camera' | 'review'>('brief');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [showUsername, setShowUsername] = useState(true);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const beastWeek = MOCK_BEAST_WEEK;
  const maxDuration = beastWeek.maxDuration;

  // Start camera when entering camera step
  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step, facingMode]);

  // Timer for recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, maxDuration]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    // Cleanup video ref
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    if (!stream) return;

    chunksRef.current = [];

    // Check for supported mime types
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
    }
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const file = new File([blob], `beast-${Date.now()}.webm`, { type: mimeType });

      // Clean up old preview URL
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }

      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setIsRecording(false);
      setStep('review');
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      alert('Recording failed. Please try again.');
      setIsRecording(false);
    };

    mediaRecorderRef.current = mediaRecorder;

    try {
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (error) {
      console.error('Start recording error:', error);
      alert('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleSubmit = async () => {
    if (!agreedToRules || !videoFile) return;

    // In production, this would upload to backend
    console.log('Submitting Beast Clip:', {
      videoFile,
      caption,
      showUsername,
      beastWeekId: beastWeek.id,
    });

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Navigate to success
    router.push('/beast/submit/success');
  };

  // Step 1: Brief Screen
  if (step === 'brief') {
    return (
      <div className="min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-accent-fire via-brand-pink to-brand-purple">
          <div className="absolute inset-0 backdrop-blur-3xl bg-dark-bg/40" />

          <div className="relative px-6 pt-8 pb-12 space-y-6">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </Link>

            {/* Title */}
            <div className="space-y-3">
              <span className="text-4xl">🎬</span>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Record Your Beast Clip
              </h1>
              <p className="text-lg text-white/90">
                {beastWeek.title}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary">
              Quick Tips
            </h2>

            {[
              `Keep it under ${maxDuration} seconds`,
              'Make it campus-appropriate',
              'Original content only (no reposts)',
              'Film in good lighting',
              'Have fun and be creative!',
            ].map((tip, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-fire/20 flex items-center justify-center mt-0.5">
                  <span className="text-xs text-accent-fire font-bold">{index + 1}</span>
                </div>
                <p className="text-sm text-text-secondary flex-1">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          {/* Rules Reminder */}
          <div className="glass-elevated p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h3 className="text-sm font-semibold text-text-primary">
                Remember the Rules
              </h3>
            </div>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Your submission must follow campus community guidelines. Inappropriate content will be removed.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-dark-border safe-bottom">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setStep('camera')}
              className="btn-primary w-full"
            >
              Open Camera
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Camera/Recording Screen
  if (step === 'camera') {
    return (
      <div className="min-h-screen bg-black flex flex-col relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 safe-top z-10 flex items-center justify-between">
          <button
            onClick={() => setStep('brief')}
            className="w-10 h-10 rounded-full glass-elevated flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {isRecording ? (
            <div className="glass-elevated px-4 py-2 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-white">
                {recordingTime}s / {maxDuration}s
              </span>
            </div>
          ) : (
            <div className="glass-elevated px-4 py-2 rounded-full">
              <span className="text-sm font-semibold text-white">
                🎬 Beast Clip — {maxDuration}s max
              </span>
            </div>
          )}

          <button
            onClick={toggleCamera}
            className="w-10 h-10 rounded-full glass-elevated flex items-center justify-center text-white"
            disabled={isRecording}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Camera Preview */}
        <div className="flex-1 w-full relative overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Recording Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 safe-bottom">
          <div className="flex items-center justify-center gap-8">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-20 h-20 rounded-full bg-accent-fire flex items-center justify-center shadow-glow active:scale-90 transition-transform"
              >
                <div className="w-16 h-16 rounded-full border-4 border-white" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-accent-fire flex items-center justify-center shadow-glow active:scale-90 transition-transform"
              >
                <div className="w-8 h-8 rounded bg-white" />
              </button>
            )}
          </div>

          <p className="text-center text-white/70 text-xs mt-4">
            {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
          </p>
        </div>
      </div>
    );
  }

  // Step 3: Review Screen
  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-dark-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              setStep('camera');
              setVideoFile(null);
              setVideoPreviewUrl('');
            }}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <span className="text-sm font-medium">Retake</span>
          </button>

          <h1 className="text-lg font-bold text-text-primary">
            Review & Submit
          </h1>

          <div className="w-16" />
        </div>
      </div>

      {/* Video Preview */}
      <div className="px-6 pt-6 space-y-6">
        <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-dark-surface">
          {videoPreviewUrl && (
            <video
              src={videoPreviewUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </div>

        {/* Caption Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-primary">
            Add a caption (optional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Tell your campus what this is about..."
            className="
              w-full px-4 py-3 rounded-xl
              bg-dark-surface text-text-primary
              border border-dark-border focus:border-brand-mocha
              placeholder:text-text-tertiary
              resize-none h-24
              transition-colors outline-none
            "
            maxLength={150}
          />
          <div className="flex justify-end">
            <span className="text-xs text-text-tertiary">
              {caption.length}/150
            </span>
          </div>
        </div>

        {/* Username Toggle */}
        <div className="flex items-center justify-between p-4 glass-elevated rounded-xl">
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              Show username on winners list
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              Your clip will still be visible, but your name will be hidden
            </p>
          </div>
          <button
            onClick={() => setShowUsername(!showUsername)}
            className={`
              relative w-12 h-7 rounded-full transition-colors
              ${showUsername ? 'bg-accent-fire' : 'bg-dark-border'}
            `}
          >
            <div
              className={`
                absolute top-1 w-5 h-5 rounded-full bg-white shadow-md
                transition-transform duration-200
                ${showUsername ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>

        {/* Rules Agreement */}
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-dark-border checked:bg-accent-fire checked:border-accent-fire cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-sm text-text-primary">
                I understand this will be visible to my campus only and must follow community guidelines.
              </p>
            </div>
          </label>

          <div className="glass-elevated p-3 rounded-xl">
            <p className="text-xs text-text-tertiary leading-relaxed">
              By submitting, you agree to the Beast Challenge rules and campus content policy.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-dark-border safe-bottom">
        <div className="max-w-2xl mx-auto space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!agreedToRules}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Beast Clip
          </button>
        </div>
      </div>
    </div>
  );
}
