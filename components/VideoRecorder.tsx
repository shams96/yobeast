'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoRecorderProps {
  maxDuration: number; // Maximum recording duration in seconds
  onRecordingComplete: (videoBlob: Blob, videoUrl: string) => void;
  onCancel: () => void;
}

type RecorderState = 'PREPARING' | 'COUNTDOWN' | 'RECORDING' | 'COMPLETED';

export default function VideoRecorder({ maxDuration, onRecordingComplete, onCancel }: VideoRecorderProps) {
  const [state, setState] = useState<RecorderState>('PREPARING');
  const [countdown, setCountdown] = useState(5); // 5-second countdown before recording
  const [recordingTime, setRecordingTime] = useState(0); // Recording timer (0-maxDuration)
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Initialize camera
  useEffect(() => {
    let mounted = true;

    async function initCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1080 },
            height: { ideal: 1920 }
          },
          audio: true
        });

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        // Auto-start countdown after camera loads
        setState('COUNTDOWN');
      } catch (error) {
        console.error('Camera access error:', error);
        alert('Unable to access camera. Please grant camera permissions.');
        onCancel();
      }
    }

    initCamera();

    return () => {
      mounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Countdown timer (5 seconds before recording)
  useEffect(() => {
    if (state !== 'COUNTDOWN') return;

    if (countdown === 0) {
      startRecording();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [state, countdown]);

  // Recording timer (0 to maxDuration seconds)
  useEffect(() => {
    if (state !== 'RECORDING') return;

    if (recordingTime >= maxDuration) {
      stopRecording();
      return;
    }

    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [state, recordingTime, maxDuration]);

  const startRecording = () => {
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Clean up stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        setState('COMPLETED');
        onRecordingComplete(blob, url);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setState('RECORDING');
      setRecordingTime(0);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to start recording. Please try again.');
      onCancel();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 bg-nightfall">
      {/* Video Preview (Full Screen) */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Unified Transparent Overlay */}
        <div className="absolute inset-0 flex flex-col pointer-events-none">
          {/* Top Bar - Transparent Controls */}
          <div className="flex items-center justify-between px-6 py-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-full bg-nightfall/40 backdrop-blur-lg border border-ash/10 text-ash font-semibold hover:bg-nightfall/60 transition-all pointer-events-auto shadow-lg"
            >
              Cancel
            </button>
            <div className="px-4 py-2 rounded-full bg-nightfall/40 backdrop-blur-lg border border-digital-grape/20">
              <span className="text-xs font-bold text-ash/80 uppercase tracking-wider">
                BEAST WEEK SUBMISSION
              </span>
            </div>
          </div>

          {/* Center - Status & Countdown */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <AnimatePresence mode="wait">
              {/* PREPARING */}
              {state === 'PREPARING' && (
                <motion.div
                  key="preparing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 border-4 border-signal-lime border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-lg font-bold text-ash drop-shadow-lg">Preparing camera...</p>
                </motion.div>
              )}

              {/* COUNTDOWN (5, 4, 3, 2, 1) */}
              {state === 'COUNTDOWN' && countdown > 0 && (
                <motion.div
                  key={`countdown-${countdown}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-[120px] font-black text-signal-lime drop-shadow-2xl">
                    {countdown}
                  </div>
                  <p className="text-xl font-bold text-ash drop-shadow-lg mt-4">Get ready!</p>
                </motion.div>
              )}

              {/* RECORDING - All-in-One Card */}
              {state === 'RECORDING' && (
                <motion.div
                  key="recording"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md mx-6"
                >
                  {/* Combined Recording Card */}
                  <div className="bg-nightfall/40 backdrop-blur-xl rounded-3xl border border-ash/10 p-6 shadow-2xl">
                    {/* Recording Badge */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <motion.div
                        className="w-3 h-3 rounded-full bg-electric-coral shadow-glow"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        RECORDING
                      </span>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-4">
                      <div className="text-6xl font-black text-signal-lime tabular-nums drop-shadow-2xl">
                        {recordingTime}s
                      </div>
                      <div className="text-xs text-ash/60 mt-2 font-semibold">
                        of {maxDuration} seconds
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 rounded-full bg-nightfall/60 border border-ash/10 overflow-hidden mb-6">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-signal-lime rounded-full shadow-glow"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(recordingTime / maxDuration) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    {/* Finish Button */}
                    {recordingTime >= 5 && recordingTime < maxDuration && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={stopRecording}
                        className="w-full px-6 py-4 rounded-2xl bg-signal-lime/95 backdrop-blur-sm text-nightfall font-bold text-base hover:bg-signal-lime hover:scale-105 active:scale-95 transition-all pointer-events-auto shadow-elevated"
                      >
                        ✓ Finish Recording ({recordingTime}s)
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Countdown Instructions */}
            {state === 'COUNTDOWN' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-3 rounded-2xl bg-nightfall/40 backdrop-blur-lg border border-ash/10 mx-6"
              >
                <p className="text-sm text-ash/80 font-semibold text-center">
                  Recording starts in {countdown} seconds
                </p>
                <p className="text-xs text-ash/50 mt-1 text-center">
                  Maximum {maxDuration} seconds • Audio enabled
                </p>
              </motion.div>
            )}
          </div>

          {/* Bottom Spacer */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
}
