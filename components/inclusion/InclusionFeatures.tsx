'use client';

import { motion } from 'framer-motion';
import { BeastClip } from '@/types';

// Anonymous Mode Toggle for submission forms
export function AnonymousModeToggle({
  isAnonymous,
  onToggle
}: {
  isAnonymous: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-carbon border border-steel/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🎭</span>
            <h4 className="text-sm font-bold text-ash">Anonymous Mode</h4>
          </div>
          <p className="text-xs text-steel leading-relaxed">
            Submit anonymously and reveal your identity only if you make the Top 10 or win.
            Perfect for trying something new without pressure!
          </p>
        </div>
        <button
          onClick={() => onToggle(!isAnonymous)}
          className={`
            relative flex-shrink-0 w-12 h-7 rounded-full transition-all
            ${isAnonymous ? 'bg-signal-lime' : 'bg-steel/30'}
          `}
        >
          <motion.div
            className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
            animate={{ left: isAnonymous ? '24px' : '4px' }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
      {isAnonymous && (
        <motion.div
          className="mt-3 p-2 rounded-lg bg-signal-lime/10 border border-signal-lime/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <p className="text-xs text-ash">
            ✓ Your submission will show as "Anonymous Student" until results are final
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// First-Timer Boost Badge - shown on clips from first-time submitters
export function FirstTimerBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-electric-coral/20 border border-electric-coral/40"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="text-xs">🌟</span>
      <span className="text-xs font-bold text-electric-coral">First Timer</span>
      <span className="text-xs text-electric-coral/80">+25 pts</span>
    </motion.div>
  );
}

// Underdog Boost Badge - shown on clips with underdog boost
export function UnderdogBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-signal-lime/20 border border-signal-lime/40"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <span className="text-xs">🚀</span>
      <span className="text-xs font-bold text-nightfall">Underdog Boost</span>
    </motion.div>
  );
}

// Underdog Spotlight Banner - shows at top of voting to highlight underdogs
export function UnderdogSpotlight({ clips }: { clips: BeastClip[] }) {
  const underdogClips = clips.filter(clip => clip.hasUnderdogBoost).slice(0, 3);

  if (underdogClips.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="p-4 rounded-2xl bg-gradient-to-r from-signal-lime/20 to-electric-coral/20 border-2 border-signal-lime/40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-signal-lime/30 flex items-center justify-center">
          <span className="text-xl">🚀</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-ash mb-1 flex items-center gap-2">
            Underdog Spotlight
            <span className="px-2 py-0.5 rounded-full bg-signal-lime/30 text-[10px] font-bold text-nightfall">
              NO STUDENT LEFT BEHIND
            </span>
          </h3>
          <p className="text-xs text-steel leading-relaxed mb-3">
            These creators are competing for the first time or haven't won recently.
            Give them an extra look - fresh voices make Yollr better!
          </p>
          <div className="flex gap-2 flex-wrap">
            {underdogClips.map(clip => (
              <div
                key={clip.id}
                className="px-3 py-1.5 rounded-lg bg-nightfall/40 border border-ash/20"
              >
                <span className="text-xs font-semibold text-ash">
                  {clip.isAnonymous ? '🎭 Anonymous' : `@${clip.userId.slice(0, 10)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Mental Health Resources Banner - shown during high-stress periods
export function MentalHealthBanner() {
  return (
    <motion.div
      className="p-4 rounded-2xl bg-ice-cyan/10 border border-ice-cyan/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ice-cyan/20 flex items-center justify-center">
          <span className="text-xl">💙</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-ash mb-1">Your Well-being Matters</h3>
          <p className="text-xs text-steel leading-relaxed mb-2">
            Competition should be fun! If you're feeling stressed or anxious,
            campus resources are here to help.
          </p>
          <div className="flex gap-2 flex-wrap">
            <a
              href="#"
              className="px-3 py-1.5 rounded-lg bg-ice-cyan/20 border border-ice-cyan/40 text-xs font-semibold text-ash hover:bg-ice-cyan/30 transition-colors"
            >
              📞 Crisis Line
            </a>
            <a
              href="#"
              className="px-3 py-1.5 rounded-lg bg-ice-cyan/20 border border-ice-cyan/40 text-xs font-semibold text-ash hover:bg-ice-cyan/30 transition-colors"
            >
              🏥 Counseling Center
            </a>
            <a
              href="#"
              className="px-3 py-1.5 rounded-lg bg-ice-cyan/20 border border-ice-cyan/40 text-xs font-semibold text-ash hover:bg-ice-cyan/30 transition-colors"
            >
              💬 Peer Support
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// First-Time Submission Encouragement - shown to users who haven't submitted yet
export function FirstTimeEncouragement({ userName }: { userName?: string }) {
  return (
    <motion.div
      className="p-4 rounded-2xl bg-gradient-to-br from-electric-coral/20 to-signal-lime/20 border-2 border-electric-coral/40"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-electric-coral/30 flex items-center justify-center">
          <span className="text-2xl">🌟</span>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-black text-ash mb-1">
            Ready to Join the Beast Challenge{userName ? `, ${userName}` : ''}?
          </h3>
          <p className="text-xs text-steel leading-relaxed mb-3">
            First-time submitters get a <span className="font-bold text-electric-coral">+25 point boost</span> and
            <span className="font-bold text-electric-coral"> 1.2x vote weight</span> to help you compete!
            Don't worry about being perfect - authenticity wins.
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl bg-electric-coral text-nightfall font-bold text-sm hover:scale-105 active:scale-95 transition-transform">
              Submit Your First Clip 🎬
            </button>
            <span className="text-xs text-steel">or</span>
            <button className="px-3 py-2 rounded-xl bg-nightfall/40 border border-ash/30 text-ash font-semibold text-xs hover:bg-nightfall/60 transition-colors">
              🎭 Go Anonymous
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
