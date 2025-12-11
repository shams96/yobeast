import Feed from '@/components/Feed';
import { MOCK_BEAST_WEEK } from '@/types';
import { MOCK_POLLS, MOCK_MOMENTS } from '@/lib/mockData';

export const metadata = {
  title: 'Yollr Beast™ — Your Campus, Your Arena',
  description: 'Every week, your campus competes in Yollr Beast™. Submit clips, vote for winners, and become Beast of the Week.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Feed
        beastWeek={MOCK_BEAST_WEEK}
        polls={MOCK_POLLS}
        moments={MOCK_MOMENTS}
      />
    </div>
  );
}
