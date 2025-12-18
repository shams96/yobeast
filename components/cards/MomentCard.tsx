'use client';

import { Moment } from '@/types';
import { useState } from 'react';

interface MomentCardProps {
  moment: Moment;
  onReact?: (emoji: string) => void;
}

export default function MomentCard({ moment, onReact }: MomentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [reactionCount, setReactionCount] = useState(moment.reactionsCount);
  const [hasReacted, setHasReacted] = useState(false);

  const handleReact = (emoji: string) => {
    if (hasReacted) return;
    setReactionCount(prev => prev + 1);
    setHasReacted(true);
    onReact?.(emoji);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="w-full px-4">
      <div className="card space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* User Avatar - Solid color */}
            <div className="w-10 h-10 rounded-full bg-digital-grape flex items-center justify-center text-ash font-semibold text-sm border-2 border-digital-grape/30">
              {moment.user?.name.charAt(0) || 'A'}
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ash">
                {moment.user?.name || 'Anonymous'}
              </span>
              <span className="text-xs text-steel">
                {getTimeAgo(moment.createdAt)}
              </span>
            </div>
          </div>

          {/* Beast Moment Badge */}
          {moment.isBeastMoment && (
            <div className="flex items-center gap-1 bg-electric-coral/15 px-2.5 py-1 rounded-full border border-electric-coral/30">
              <span className="text-xs">🔥</span>
              <span className="text-xs font-semibold text-electric-coral">
                Beast Week
              </span>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-carbon">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {moment.imageUrl && (
            <img
              src={moment.imageUrl}
              alt={moment.caption}
              className={`
                w-full h-full object-cover
                transition-opacity duration-300
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {moment.videoUrl && (
            <video
              src={moment.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setImageLoaded(true)}
            />
          )}

          {/* Reaction Button Overlay - Solid background */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <button
              onClick={() => handleReact('🔥')}
              disabled={hasReacted}
              className={`
                w-12 h-12 rounded-full
                bg-carbon/90 border-2 border-ash/30
                flex flex-col items-center justify-center
                active:scale-90 transition-all duration-150
                shadow-elevated
                ${hasReacted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:border-future-dusk'}
              `}
            >
              <span className="text-lg">🔥</span>
              {reactionCount > 0 && (
                <span className="text-[10px] font-bold text-ash">
                  {reactionCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Caption */}
        {moment.caption && (
          <p className="text-sm text-steel leading-relaxed">
            {moment.caption}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-steel">
          <span>Expires in {Math.floor((new Date(moment.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))}h</span>
          {moment.allowInBeastReel && (
            <span className="text-digital-grape font-medium">
              ✨ Beast Reel Eligible
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
