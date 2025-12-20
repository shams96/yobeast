'use client';

import { useState, useRef } from 'react';
import { useBeastWeekCycle } from '@/context/BeastWeekCycleContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BeastSubmitPage() {
  const router = useRouter();
  const { currentWeek, currentPhase, hasSubmitted, submitVideo } = useBeastWeekCycle();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentWeek) {
    return <div className="min-h-screen bg-nightfall flex items-center justify-center"><p className="text-steel">Loading...</p></div>;
  }

  if (currentPhase !== 'SUBMISSIONS_OPEN') {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-black text-ash">Submissions Closed</h1>
          <p className="text-steel">Submissions are only open Tuesday-Wednesday.</p>
          <Link href="/"><button className="px-6 py-3 rounded-xl bg-digital-grape text-ash font-bold hover:scale-105 transition-transform">Back to Feed</button></Link>
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-nightfall px-4 py-8">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-black text-ash">Submitted!</h1>
          <p className="text-steel">Voting opens Thursday!</p>
          <Link href="/"><button className="px-6 py-3 rounded-xl bg-signal-lime text-nightfall font-bold hover:scale-105 transition-transform">Back to Feed</button></Link>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('video/')) return alert('Please select a video file');
    if (file.size > 100 * 1024 * 1024) return alert('Video too large (max 100MB)');
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!videoFile || !caption.trim()) return alert('Please add video and caption');
    const reader = new FileReader();
    reader.onloadend = () => {
      submitVideo({ videoUrl: reader.result as string, caption: caption.trim(), duration: 30 });
      router.push('/');
    };
    reader.readAsDataURL(videoFile);
  };

  return (
    <div className="min-h-screen bg-nightfall pb-20">
      <div className="sticky top-0 z-10 bg-nightfall/95 backdrop-blur-lg border-b border-steel/20">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-steel hover:text-ash transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-black text-ash">Submit Beast Video</h1>
          <button onClick={handleSubmit} disabled={!videoFile || !caption.trim()} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${videoFile && caption.trim() ? 'bg-signal-lime text-nightfall hover:scale-105' : 'bg-carbon/50 text-steel/50 cursor-not-allowed'}`}>Submit</button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-gradient-to-br from-digital-grape/20 to-brand-mocha/20 border border-digital-grape/40 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎬</span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-ash mb-1">{currentWeek.title}</h2>
              <p className="text-sm text-steel mb-3">{currentWeek.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-signal-lime">PRIZE:</span>
                <span className="text-sm font-bold text-ash">{currentWeek.prize.displayString}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-steel">Rules:</p>
                {currentWeek.rules.map((rule, i) => (<p key={i} className="text-xs text-steel/70">• {rule}</p>))}
              </div>
            </div>
          </div>
        </div>

        {!videoPreview ? (
          <div>
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gradient-to-r from-electric-coral to-signal-lime text-nightfall font-bold text-lg px-8 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3">
              <span className="text-2xl">📂</span><span>Select Video</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-carbon">
              <video src={videoPreview} controls className="w-full h-full object-cover" />
            </div>
            <button onClick={() => { setVideoFile(null); setVideoPreview(null); }} className="w-full px-4 py-3 rounded-xl bg-carbon border border-steel/20 text-steel font-semibold hover:border-ash transition-colors">Change Video</button>
          </div>
        )}

        {videoPreview && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-ash">Caption</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Describe your submission..." maxLength={200} className="w-full px-4 py-3 rounded-xl bg-carbon border border-steel/20 text-ash placeholder-steel/50 resize-none focus:border-signal-lime focus:outline-none transition-colors" rows={3} />
            <p className="text-xs text-steel text-right">{caption.length}/200</p>
          </div>
        )}
      </div>
    </div>
  );
}
