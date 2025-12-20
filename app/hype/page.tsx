'use client';

import { useHypePolls } from '@/context/HypePollsContext';
import HypePollCard from '@/components/HypePollCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HypePollsPage() {
  const { dailyPolls, myNotifications, totalCompliments, markNotificationRead } = useHypePolls();

  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-nightfall pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-nightfall/95 backdrop-blur-lg border-b border-steel/20 safe-top">
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-steel hover:text-ash transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          <h1 className="text-xl font-black text-ash">
            Hype Polls
          </h1>

          {/* Notification Badge */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-digital-grape/20 flex items-center justify-center">
              <span className="text-xl">🔔</span>
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-electric-coral flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Compliment Counter */}
        {totalCompliments > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-signal-lime/20 to-electric-coral/20 border-2 border-signal-lime/40 rounded-2xl p-6 text-center"
          >
            <div className="text-6xl mb-3">🔥</div>
            <h2 className="text-4xl font-black text-ash mb-2">
              {totalCompliments}
            </h2>
            <p className="text-sm font-semibold text-steel">
              Total compliments received
            </p>
            <p className="text-xs text-steel/70 mt-2">
              You're making waves on campus! 🌊
            </p>
          </motion.div>
        )}

        {/* Mystery Notifications */}
        {myNotifications.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-ash">Your Mystery Compliments</h2>
              <span className="text-xs text-steel">👀</span>
            </div>

            {myNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-xl border
                  ${notification.isRead
                    ? 'bg-carbon/30 border-steel/20'
                    : 'bg-digital-grape/20 border-digital-grape/40'
                  }
                `}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💜</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ash mb-1">
                      {notification.count} {notification.count === 1 ? 'person thinks' : 'people think'}...
                    </p>
                    <p className="text-xs text-steel leading-relaxed">
                      "{notification.pollQuestion}"
                    </p>
                    <p className="text-xs text-steel/70 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-signal-lime" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gradient-to-br from-brand-mocha/20 to-digital-grape/20 border border-brand-mocha/40 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="text-sm font-bold text-ash mb-1">
                How Hype Polls Work
              </h3>
              <ul className="text-xs text-steel space-y-1 leading-relaxed">
                <li>• Vote for classmates on positive questions</li>
                <li>• 100% anonymous - they'll never know it was you</li>
                <li>• They get a mystery notification with the count</li>
                <li>• Spread positivity across your campus! 💜</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Daily Polls */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-ash">Today's Polls</h2>

          {dailyPolls.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🎭</div>
              <p className="text-steel">No polls available right now</p>
              <p className="text-xs text-steel/70 mt-2">Check back tomorrow!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyPolls.map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HypePollCard pollId={poll.id} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Message */}
        <div className="text-center py-6">
          <p className="text-xs text-steel/70">
            New polls drop daily at midnight 🌙
          </p>
        </div>
      </div>
    </div>
  );
}
