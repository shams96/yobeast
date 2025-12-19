'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { QRCodeSVG } from 'qrcode.react';

export default function InvitesPage() {
  const { user, loading } = useCurrentUser();
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = user ? `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?code=${user.inviteCode}` : '';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareVia = (platform: string) => {
    const message = `Join me on Yollr Beast! Use my code: ${user?.inviteCode} or click: ${inviteLink}`;
    const encodedMessage = encodeURIComponent(message);

    const urls: { [key: string]: string } = {
      sms: `sms:?body=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-text-secondary">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent-fire via-brand-pink to-brand-mocha p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Invite Friends</h1>
          <p className="text-white/80">Share Yollr Beast and earn rewards</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Invite Slots Card */}
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Your Invites</h2>
              <p className="text-sm text-text-secondary">
                {user.inviteSlots} {user.inviteSlots === 1 ? 'invite' : 'invites'} remaining
              </p>
            </div>
            <div className="text-4xl font-bold text-gradient">{user.inviteSlots}</div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-dark-elevated rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-accent-fire to-brand-pink h-2 rounded-full transition-all"
              style={{ width: `${(user.inviteSlots / 10) * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            Earn more invites by being active in the app
          </p>
        </div>

        {/* Invite Code Card */}
        <div className="card-elevated p-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-text-secondary block mb-2">
              Your Invite Code
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 p-4 bg-dark-elevated border-2 border-brand-mocha rounded-lg">
                <p className="text-3xl font-mono font-bold text-center text-gradient tracking-widest">
                  {user.inviteCode}
                </p>
              </div>
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-brand-mocha text-white rounded-lg font-semibold hover:shadow-glow transition-all"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div>
            <label className="text-sm font-semibold text-text-secondary block mb-2">
              Share Your Link
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => shareVia('sms')}
                className="px-4 py-3 bg-dark-elevated hover:bg-dark-border rounded-lg font-semibold text-text-primary transition-all flex items-center justify-center gap-2"
              >
                <span>📱</span> SMS
              </button>
              <button
                onClick={() => shareVia('whatsapp')}
                className="px-4 py-3 bg-dark-elevated hover:bg-dark-border rounded-lg font-semibold text-text-primary transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span> WhatsApp
              </button>
              <button
                onClick={() => shareVia('twitter')}
                className="px-4 py-3 bg-dark-elevated hover:bg-dark-border rounded-lg font-semibold text-text-primary transition-all flex items-center justify-center gap-2"
              >
                <span>🐦</span> Twitter
              </button>
              <button
                onClick={() => setShowQR(!showQR)}
                className="px-4 py-3 bg-dark-elevated hover:bg-dark-border rounded-lg font-semibold text-text-primary transition-all flex items-center justify-center gap-2"
              >
                <span>📷</span> QR Code
              </button>
            </div>

            {/* QR Code */}
            {showQR && (
              <div className="mt-4 p-4 bg-white rounded-lg flex justify-center">
                <QRCodeSVG value={inviteLink} size={200} />
              </div>
            )}

            <button
              onClick={copyToClipboard}
              className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-accent-fire to-brand-pink text-white rounded-lg font-semibold hover:shadow-glow transition-all"
            >
              Copy Invite Link
            </button>
          </div>
        </div>

        {/* Rewards Card */}
        <div className="card-elevated p-6 space-y-4">
          <h2 className="text-xl font-bold text-text-primary">💰 Earn Rewards</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
              <span className="text-text-secondary">Per successful invite</span>
              <span className="text-brand-mocha font-bold">+50 points</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-elevated rounded-lg">
              <span className="text-text-secondary">Beast Tokens</span>
              <span className="text-brand-pink font-bold">+25 tokens</span>
            </div>
          </div>

          {/* Tier Info */}
          <div className="pt-4 border-t border-dark-border">
            <p className="text-sm text-text-tertiary mb-2">Unlock higher rewards:</p>
            <ul className="space-y-1 text-sm text-text-secondary">
              <li>🌟 5+ invites: +75 points, +50 tokens</li>
              <li>🔥 10+ invites: +100 points, +100 tokens</li>
              <li>👑 25+ invites: Unlimited invites!</li>
            </ul>
          </div>
        </div>

        {/* Stats Card */}
        <div className="card-elevated p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4">🏆 Your Invite Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-dark-elevated rounded-lg">
              <div className="text-3xl font-bold text-gradient mb-1">
                {user.totalInvites}
              </div>
              <div className="text-xs text-text-tertiary">Total Invites</div>
            </div>
            <div className="text-center p-4 bg-dark-elevated rounded-lg">
              <div className="text-3xl font-bold text-gradient mb-1">
                {user.inviteRank || '—'}
              </div>
              <div className="text-xs text-text-tertiary">Campus Rank</div>
            </div>
          </div>
        </div>

        {/* Unlock Message */}
        {!user.canInvite && (
          <div className="card-elevated p-6 bg-gradient-to-r from-accent-fire/10 to-brand-pink/10 border-2 border-brand-mocha/30">
            <h3 className="text-lg font-bold text-text-primary mb-2">
              🔒 Unlock More Invites
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              Stay active to unlock unlimited invites! Current engagement score: {user.engagementScore}/70
            </p>
            <ul className="space-y-1 text-xs text-text-tertiary">
              <li>✓ Vote in Beast Week competitions</li>
              <li>✓ Return for 7 days in a row</li>
              <li>✓ Post moments and react to content</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
