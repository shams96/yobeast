import { BeastPhase } from '@/types';

export interface PhaseConfig {
  title: string;
  emoji: string;
  description: string;
  cta: string;
  ctaLink: string;
  subtext: string;
  colors: {
    bg: string;
    text: string;
    buttonBg: string;
    buttonText: string;
  };
  timelineLabel: string;
  tooltip: string;
}

export const PHASE_CONFIG: Record<BeastPhase, PhaseConfig> = {
  BEAST_REVEAL: {
    title: "Challenge Revealed",
    emoji: "🎬",
    description: "This week's challenge is LIVE! Check out the theme, rules, and prize. Get ready to submit your video starting Tuesday!",
    cta: "View Challenge Details",
    ctaLink: "/beast",
    subtext: "Submissions open Tuesday at midnight",
    colors: {
      bg: "from-digital-grape to-electric-coral",
      text: "text-signal-lime",
      buttonBg: "bg-nightfall",
      buttonText: "text-signal-lime"
    },
    timelineLabel: "Reveal",
    tooltip: "Monday: Beast Week challenge announced with theme, rules, and prize details"
  },

  SUBMISSIONS_OPEN: {
    title: "Submissions Open",
    emoji: "📹",
    description: "Submit your best campus content and compete to become this week's Beast champion! Record your video now and show your campus spirit.",
    cta: "Submit Your Video",
    ctaLink: "/beast/submit",
    subtext: "Deadline: Wednesday 11:59 PM • One submission per student",
    colors: {
      bg: "from-electric-coral to-signal-lime",
      text: "text-nightfall",
      buttonBg: "bg-nightfall",
      buttonText: "text-signal-lime"
    },
    timelineLabel: "Submit",
    tooltip: "Tuesday-Wednesday: Submit your best 30-second campus video"
  },

  VOTING_OPEN: {
    title: "Voting Open",
    emoji: "🗳️",
    description: "Vote for your favorite submissions! Help crown this week's Beast champion. Watch the videos and pick your favorite.",
    cta: "Vote Now",
    ctaLink: "/beast/vote",
    subtext: "One vote per student • Voting ends Saturday 11:59 PM",
    colors: {
      bg: "from-signal-lime to-digital-grape",
      text: "text-nightfall",
      buttonBg: "bg-nightfall",
      buttonText: "text-signal-lime"
    },
    timelineLabel: "Vote",
    tooltip: "Thursday-Saturday: Vote for your favorite Beast submission (one vote per student)"
  },

  FINALE_DAY: {
    title: "Live Finale",
    emoji: "🏆",
    description: "Join the live finale! Watch as we reveal this week's Beast champion and celebrate the top 3 finalists. Don't miss the moment!",
    cta: "Watch Finale Live",
    ctaLink: "/beast/finale",
    subtext: "Saturday 6:00 PM • Winner announced live with confetti 🎉",
    colors: {
      bg: "from-electric-coral to-brand-mocha",
      text: "text-signal-lime",
      buttonBg: "bg-signal-lime",
      buttonText: "text-nightfall"
    },
    timelineLabel: "Finale",
    tooltip: "Saturday 6:00 PM: Live winner reveal with top 3 podium and prize announcement"
  },

  COOLDOWN_REEL: {
    title: "Beast Reel",
    emoji: "🎞️",
    description: "Relive the best moments! Watch this week's top 5 submissions and celebrate our champion. Swipe through the highlights reel.",
    cta: "Watch Highlights Reel",
    ctaLink: "/beast/reel",
    subtext: "Next challenge reveals Monday • Enjoy the highlights",
    colors: {
      bg: "from-digital-grape to-nightfall",
      text: "text-ash",
      buttonBg: "bg-electric-coral",
      buttonText: "text-nightfall"
    },
    timelineLabel: "Reel",
    tooltip: "Sunday: Watch highlights reel of top 5 submissions and celebrate this week's champion"
  }
};

// Helper function to get phase-specific user status message
export function getUserStatusMessage(
  phase: BeastPhase,
  hasSubmitted: boolean,
  hasVoted: boolean
): string {
  switch (phase) {
    case 'BEAST_REVEAL':
      return "Challenge is live! Prepare your best content.";

    case 'SUBMISSIONS_OPEN':
      return hasSubmitted
        ? "✅ Your submission is in! Check back Thursday to vote."
        : "⏰ Don't miss out! Submit your video before Wednesday 11:59 PM.";

    case 'VOTING_OPEN':
      return hasVoted
        ? "✅ Your vote is locked in! Check the finale Saturday at 6 PM."
        : "⏰ Cast your vote before Saturday 11:59 PM!";

    case 'FINALE_DAY':
      return "🏆 Finale is LIVE! See who wins the championship.";

    case 'COOLDOWN_REEL':
      return "🎞️ Relive this week's best moments. New challenge drops Monday!";

    default:
      return "";
  }
}

// Get next phase information
export function getNextPhaseInfo(currentPhase: BeastPhase): {
  nextPhase: BeastPhase;
  day: string;
} {
  const phaseOrder: BeastPhase[] = [
    'BEAST_REVEAL',
    'SUBMISSIONS_OPEN',
    'VOTING_OPEN',
    'FINALE_DAY',
    'COOLDOWN_REEL'
  ];

  const currentIndex = phaseOrder.indexOf(currentPhase);
  const nextIndex = (currentIndex + 1) % phaseOrder.length;

  const nextPhase = phaseOrder[nextIndex];
  const dayMap: Record<BeastPhase, string> = {
    BEAST_REVEAL: 'Monday',
    SUBMISSIONS_OPEN: 'Tuesday',
    VOTING_OPEN: 'Thursday',
    FINALE_DAY: 'Saturday 6PM',
    COOLDOWN_REEL: 'Sunday'
  };

  return {
    nextPhase,
    day: dayMap[nextPhase]
  };
}
