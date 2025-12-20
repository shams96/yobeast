'use client';

import { Moment } from '@/types';
import { useState, useEffect } from 'react';
import RealMojiPicker from '../RealMojiPicker';
import { isFirebaseConfigured } from '@/lib/firebase';
import {
  getMomentReactions,
  subscribeReactions,
  createRealMojiReaction,
} from '@/lib/firestore';
import type { RealMojiReaction } from '@/types';

interface MomentCardProps {
  moment: Moment;
  onReact?: (emoji: string) => void;
}

export default function MomentCard({ moment, onReact }: MomentCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showRealMojiPicker, setShowRealMojiPicker] = useState(false);
  const [reactions, setReactions] = useState<RealMojiReaction[]>([]);
  const [hasReacted, setHasReacted] = useState(false);

  const useFirebase = isFirebaseConfigured();

  // Load reactions on mount
  useEffect(() => {
    if (useFirebase) {
      loadFirebaseReactions();
    } else {
      loadLocalStorageReactions();
    }
  }, [moment.id, useFirebase]);

  // Subscribe to real-time reaction updates
  useEffect(() => {
    if (!useFirebase) return;

    const unsubscribe = subscribeReactions(moment.id, (fetchedReactions) => {
      setReactions(fetchedReactions);

      // Check if current user has already reacted
      const currentUserId = 'current_user'; // TODO: Replace with real auth
      const userReacted = fetchedReactions.some(r => r.userId === currentUserId);
      setHasReacted(userReacted);
    });

    return () => unsubscribe();
  }, [moment.id, useFirebase]);

  const loadFirebaseReactions = async () => {
    try {
      const fetchedReactions = await getMomentReactions(moment.id);
      setReactions(fetchedReactions);

      const currentUserId = 'current_user';
      const userReacted = fetchedReactions.some(r => r.userId === currentUserId);
      setHasReacted(userReacted);
    } catch (error) {
      console.error('Error loading Firebase reactions:', error);
      loadLocalStorageReactions(); // Fallback to localStorage
    }
  };

  const loadLocalStorageReactions = () => {
    const storedReactions = localStorage.getItem(`realmoji_${moment.id}`);
    if (storedReactions) {
      const parsed = JSON.parse(storedReactions);
      setReactions(parsed.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
      })));

      // Check if current user has already reacted
      const currentUserId = 'current_user';
      const userReacted = parsed.some((r: any) => r.userId === currentUserId);
      setHasReacted(userReacted);
    }
  };

  const handleReactionSubmit = async (emoji: string, selfieDataUrl: string) => {
    const currentUserId = 'current_user'; // TODO: Replace with real auth
    const currentUserName = 'You'; // TODO: Get from auth context

    try {
      if (useFirebase) {
        // Create reaction in Firestore
        await createRealMojiReaction({
          momentId: moment.id,
          userId: currentUserId,
          userName: currentUserName,
          emoji,
          selfieDataUrl,
        });

        // State updates happen automatically via real-time listener
        setShowRealMojiPicker(false);
        onReact?.(emoji);
      } else {
        // Fallback to localStorage
        const newReaction: RealMojiReaction = {
          id: `reaction_${Date.now()}`,
          emoji,
          selfieDataUrl,
          userId: currentUserId,
          userName: currentUserName,
          createdAt: new Date(),
          momentId: moment.id,
        };

        const updatedReactions = [...reactions, newReaction];
        setReactions(updatedReactions);
        setHasReacted(true);
        setShowRealMojiPicker(false);

        // Save to localStorage
        localStorage.setItem(`realmoji_${moment.id}`, JSON.stringify(updatedReactions));
        onReact?.(emoji);
      }
    } catch (error) {
      console.error('Error creating reaction:', error);
      alert('Failed to save reaction. Please try again.');
    }
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

          <div className="flex items-center gap-2">
            {/* Beast Moment Badge */}
            {moment.isBeastMoment && (
              <div className="flex items-center gap-1 bg-electric-coral/15 px-2.5 py-1 rounded-full border border-electric-coral/30">
                <span className="text-xs">🔥</span>
                <span className="text-xs font-semibold text-electric-coral">
                  Beast Week
                </span>
              </div>
            )}

            {/* Late Badge - 4Real mechanic */}
            {moment.isLate && (
              <div className="flex items-center gap-1 bg-steel/15 px-2.5 py-1 rounded-full border border-steel/30">
                <span className="text-xs">⏰</span>
                <span className="text-xs font-semibold text-steel">
                  Late
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-carbon">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {/* Support both old format (imageUrl/videoUrl) and new format (mediaUrl/mediaType) */}
          {(moment.imageUrl || ((moment as any).mediaUrl && (moment as any).mediaType === 'image')) && (
            <img
              src={moment.imageUrl || (moment as any).mediaUrl}
              alt={moment.caption}
              className={`
                w-full h-full object-cover
                transition-opacity duration-300
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {(moment.videoUrl || ((moment as any).mediaUrl && (moment as any).mediaType === 'video')) && (
            <video
              src={moment.videoUrl || (moment as any).mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setImageLoaded(true)}
            />
          )}

          {/* RealMoji Reaction Button Overlay */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <button
              onClick={() => setShowRealMojiPicker(true)}
              disabled={hasReacted}
              className={`
                w-12 h-12 rounded-full
                bg-gradient-to-br from-signal-lime/90 to-electric-coral/90 border-2 border-white/50
                flex flex-col items-center justify-center
                active:scale-90 transition-all duration-150
                shadow-elevated
                ${hasReacted ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:border-white'}
              `}
            >
              <span className="text-lg">📸</span>
              {reactions.length > 0 && (
                <span className="text-[10px] font-bold text-nightfall">
                  {reactions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* RealMoji Reactions Display */}
        {reactions.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-steel whitespace-nowrap">RealMojis:</span>
            <div className="flex gap-2">
              {reactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="relative flex-shrink-0 group"
                  title={`${reaction.userName} reacted with ${reaction.emoji}`}
                >
                  {/* Selfie with emoji overlay */}
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-digital-grape/40 hover:border-signal-lime transition-colors">
                    <img
                      src={reaction.selfieDataUrl}
                      alt={`${reaction.userName}'s reaction`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Emoji badge */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-nightfall border border-steel/30 flex items-center justify-center">
                    <span className="text-xs">{reaction.emoji}</span>
                  </div>
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-nightfall border border-steel/20 rounded-lg whitespace-nowrap text-xs text-ash opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {reaction.userName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* RealMoji Picker Modal */}
      {showRealMojiPicker && (
        <RealMojiPicker
          onReactionSubmit={handleReactionSubmit}
          onClose={() => setShowRealMojiPicker(false)}
        />
      )}
    </div>
  );
}
