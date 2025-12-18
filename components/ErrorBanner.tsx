'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'error';
  dismissible?: boolean;
}

export default function ErrorBanner({
  message,
  type = 'info',
  dismissible = true
}: ErrorBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = {
    info: 'bg-digital-grape/10 border-digital-grape/30 text-digital-grape',
    warning: 'bg-electric-coral/10 border-electric-coral/30 text-electric-coral',
    error: 'bg-future-dusk/10 border-future-dusk/30 text-future-dusk',
  };

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`
          mx-4 mt-4 p-3 rounded-xl border-2
          ${styles[type]}
          flex items-center justify-between gap-3
        `}
      >
        <div className="flex items-center gap-2 flex-1">
          <span className="text-lg">{icons[type]}</span>
          <p className="text-sm font-medium">{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="text-ash/50 hover:text-ash transition-colors p-1"
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
