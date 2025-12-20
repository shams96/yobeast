'use client';

import { useReals } from '@/context/RealsContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function RealsCountdown() {
  const { realsTime } = useReals();
  const router = useRouter();

  if (realsTime.hasPostedToday) {
    return (
      <div className="px-4 py-3 bg-digital-grape/20 border border-digital-grape/40 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-ash">
              You posted 4Real today!
            </p>
            {realsTime.isLate && (
              <p className="text-xs text-steel mt-0.5">
                Posted late - but that's okay!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show countdown if 4Real time is active (within 2-minute window)
  if (realsTime.isActive) {
    const minutes = Math.floor(realsTime.timeRemaining / 60);
    const seconds = realsTime.timeRemaining % 60;

    return (
      <motion.div
        className="px-4 py-4 bg-gradient-to-r from-electric-coral to-signal-lime border-2 border-electric-coral rounded-xl"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ⚠️
            </motion.span>
            <div>
              <p className="text-sm font-black text-nightfall uppercase tracking-wide">
                Time 4Real!
              </p>
              <p className="text-xs text-nightfall/80 font-semibold">
                Post within {minutes}:{seconds.toString().padStart(2, '0')} or marked late
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/moment/new')}
            className="px-4 py-2 bg-nightfall text-ash font-bold text-sm rounded-xl hover:scale-105 active:scale-95 transition-transform"
          >
            Post Now
          </button>
        </div>
      </motion.div>
    );
  }

  // Show next 4Real countdown
  const hours = Math.floor(realsTime.nextRealsIn / 3600);
  const minutes = Math.floor((realsTime.nextRealsIn % 3600) / 60);

  return (
    <div className="px-4 py-3 bg-carbon border border-steel/30 rounded-xl">
      <div className="flex items-center gap-3">
        <span className="text-xl">⏰</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ash">
            Next 4Real in {hours}h {minutes}m
          </p>
          <p className="text-xs text-steel">
            Daily 4Real time: {realsTime.todayTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
}
