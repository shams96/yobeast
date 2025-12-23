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

        {/* Overlay UI */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top Bar - Cancel Button */}
          <div className="flex items-center justify-between px-4 py-6 bg-gradient-to-b from-nightfall/80 to-transparent">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl bg-carbon/80 backdrop-blur-sm border border-steel/20 text-ash font-semibold hover:bg-carbon transition-colors"
            >
              Cancel
            </button>
            <div className="px-4 py-2 rounded-xl bg-nightfall/80 backdrop-blur-sm border border-steel/20">
              <span className="text-xs font-bold text-ash uppercase tracking-wide">
                Beast Week Submission
              </span>
            </div>
          </div>

          {/* Center - Countdown or Recording Indicator */}
          <div className="flex-1 flex items-center justify-center">
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
                  <p className="text-lg font-bold text-ash">Preparing camera...</p>
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
                  <p className="text-xl font-bold text-ash mt-4">Get ready!</p>
                </motion.div>
              )}

              {/* RECORDING - Pulsing Red Dot */}
              {state === 'RECORDING' && (
                <motion.div
                  key="recording"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-electric-coral/90 backdrop-blur-sm"
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xl font-black text-white uppercase tracking-wide">
                    Recording
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Bar - Timer and Progress */}
          <div className="px-4 py-6 bg-gradient-to-t from-nightfall/80 to-transparent">
            <AnimatePresence>
              {state === 'RECORDING' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto space-y-4"
                >
                  {/* Time Display */}
                  <div className="text-center">
                    <div className="text-5xl font-black text-signal-lime tabular-nums">
                      {recordingTime}s
                    </div>
                    <div className="text-sm text-steel mt-1">
                      of {maxDuration} seconds
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-2 rounded-full bg-carbon/50 overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-signal-lime rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${(recordingTime / maxDuration) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Early Stop Button (optional) */}
                  {recordingTime >= 5 && recordingTime < maxDuration && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={stopRecording}
                      className="w-full px-6 py-3 rounded-xl bg-signal-lime text-nightfall font-bold hover:scale-105 active:scale-95 transition-transform"
                    >
                      ✓ Finish Recording ({recordingTime}s)
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Countdown Instructions */}
              {state === 'COUNTDOWN' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-sm text-steel">
                    Recording will start automatically in {countdown} seconds
                  </p>
                  <p className="text-xs text-steel/70 mt-2">
                    Maximum {maxDuration} seconds • Audio enabled
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
