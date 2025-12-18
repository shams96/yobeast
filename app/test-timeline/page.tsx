'use client';

import BeastCard from '@/components/cards/BeastCard';
import { MOCK_BEAST_WEEK } from '@/types';

export default function TestTimelinePage() {
  return (
    <div className="min-h-screen bg-carbon">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-ash px-4 mb-4">
          Beast Timeline Test
        </h1>
        <BeastCard beastWeek={MOCK_BEAST_WEEK} />
      </div>
    </div>
  );
}
