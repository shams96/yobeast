'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RealMojiPickerProps {
  onReactionSubmit: (emoji: string, selfieDataUrl: string) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = [
  { emoji: '👍', label: 'Thumbs Up' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '😂', label: 'Funny' },
  { emoji: '😮', label: 'Surprised' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💀', label: 'Dead' },
];

export default function RealMojiPicker({ onReactionSubmit, onClose }: RealMojiPickerProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleEmojiSelect = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setCaptureMode(true);

    try {
      // Request front camera (selfie mode)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 400 },
          height: { ideal: 400 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please allow camera permissions.');
      setCaptureMode(false);
      setSelectedEmoji(null);
    }
  };

  const handleCapture = () => {
    // Start 3-second countdown
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          captureSelfie();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current || !selectedEmoji) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to data URL
    const selfieDataUrl = canvas.toDataURL('image/jpeg', 0.8);

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Submit reaction
    onReactionSubmit(selectedEmoji, selfieDataUrl);
  };

  const handleBack = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCaptureMode(false);
    setSelectedEmoji(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-nightfall/95 backdrop-blur-lg flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {!captureMode ? (
            // Emoji Selection Screen
            <div className="bg-carbon rounded-2xl p-6 border border-steel/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-ash">Pick your RealMoji</h3>
                <button
                  onClick={onClose}
                  className="text-steel hover:text-ash transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-steel mb-6">
                Choose an emoji, then capture your reaction selfie!
              </p>

              <div className="grid grid-cols-3 gap-3">
                {EMOJI_OPTIONS.map((option) => (
                  <button
                    key={option.emoji}
                    onClick={() => handleEmojiSelect(option.emoji)}
                    className="aspect-square rounded-xl bg-gradient-to-br from-digital-grape/20 to-brand-mocha/20 border border-digital-grape/40 hover:border-signal-lime transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-2"
                  >
                    <span className="text-4xl">{option.emoji}</span>
                    <span className="text-xs text-steel">{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 bg-nightfall/50 border border-steel/20 rounded-xl p-4">
                <p className="text-xs text-steel text-center leading-relaxed">
                  📸 Your selfie becomes the emoji! Make a face that matches the emotion.
                </p>
              </div>
            </div>
          ) : (
            // Selfie Capture Screen
            <div className="bg-carbon rounded-2xl overflow-hidden border border-steel/20">
              <div className="relative aspect-square bg-nightfall">
                {/* Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Canvas for capture (hidden) */}
                <canvas ref={canvasRef} className="hidden" />

                {/* Countdown Overlay */}
                {countdown !== null && (
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-nightfall/50"
                  >
                    <motion.span
                      key={countdown}
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-9xl font-black text-signal-lime"
                    >
                      {countdown}
                    </motion.span>
                  </motion.div>
                )}

                {/* Selected Emoji Indicator */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-nightfall/80 backdrop-blur-sm px-4 py-2 rounded-full border border-steel/20">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedEmoji}</span>
                    <span className="text-sm font-bold text-ash">RealMoji</span>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-nightfall/80 backdrop-blur-sm flex items-center justify-center border border-steel/20 text-steel hover:text-ash transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Capture Button */}
              <div className="p-6 bg-carbon">
                <button
                  onClick={handleCapture}
                  disabled={countdown !== null}
                  className={`
                    w-full font-bold text-lg px-8 py-4 rounded-xl transition-all
                    ${countdown !== null
                      ? 'bg-carbon/50 text-steel/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-signal-lime to-electric-coral text-nightfall hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {countdown !== null ? 'Get Ready...' : 'Capture RealMoji'}
                </button>

                <p className="text-xs text-steel text-center mt-3">
                  Make a face that matches the emoji emotion!
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
