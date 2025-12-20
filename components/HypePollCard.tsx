'use client';

import { useState } from 'react';
import { useHypePolls } from '@/context/HypePollsContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HypePollCardProps {
  pollId: string;
}

// Mock campus directory - in production, this would come from database
const MOCK_CLASSMATES = [
  { id: 'user_001', name: 'Alex Chen', campus: 'Harvard' },
  { id: 'user_002', name: 'Jordan Smith', campus: 'Harvard' },
  { id: 'user_003', name: 'Taylor Brown', campus: 'Harvard' },
  { id: 'user_004', name: 'Morgan Lee', campus: 'Harvard' },
  { id: 'user_005', name: 'Casey Kim', campus: 'Harvard' },
  { id: 'user_006', name: 'Riley Davis', campus: 'Harvard' },
  { id: 'user_007', name: 'Sam Johnson', campus: 'Harvard' },
  { id: 'user_008', name: 'Jamie Wilson', campus: 'Harvard' },
];

export default function HypePollCard({ pollId }: HypePollCardProps) {
  const { dailyPolls, voteForPerson, hasVotedOnPoll } = useHypePolls();
  const [showVoting, setShowVoting] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const poll = dailyPolls.find(p => p.id === pollId);
  const hasVoted = hasVotedOnPoll(pollId);

  if (!poll) return null;

  const handleVoteSubmit = () => {
    if (selectedPerson) {
      voteForPerson(pollId, selectedPerson);
      setShowVoting(false);
      setSelectedPerson(null);
    }
  };

  if (hasVoted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-digital-grape/10 border border-digital-grape/30 rounded-2xl p-5"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">✅</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-ash">
              Vote submitted anonymously!
            </p>
            <p className="text-xs text-steel mt-0.5">
              "{poll.question}"
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-digital-grape/20 to-brand-mocha/20 border border-digital-grape/40 rounded-2xl p-6"
    >
      {!showVoting ? (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-signal-lime uppercase tracking-wide">
                  Hype Poll
                </span>
                <span className="text-xs text-steel">• Anonymous</span>
              </div>
              <h3 className="text-lg font-bold text-ash leading-snug">
                {poll.question}
              </h3>
            </div>
            <span className="text-2xl">🔥</span>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-2 text-xs text-steel">
            <span className="font-semibold text-signal-lime">{poll.votesCount}</span>
            <span>people voted</span>
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowVoting(true)}
            className="w-full bg-gradient-to-r from-digital-grape to-brand-mocha text-ash font-bold text-sm px-6 py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform"
          >
            Vote Anonymously
          </button>

          {/* Privacy Message */}
          <p className="text-xs text-steel/70 text-center">
            100% anonymous • Spread positivity 💜
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Back Button */}
            <button
              onClick={() => setShowVoting(false)}
              className="flex items-center gap-2 text-sm text-steel hover:text-ash transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {/* Question */}
            <div>
              <h3 className="text-base font-bold text-ash mb-1">
                {poll.question}
              </h3>
              <p className="text-xs text-steel">
                Select a classmate to vote for
              </p>
            </div>

            {/* Person Selector */}
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {MOCK_CLASSMATES.map((person) => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPerson(person.id)}
                  className={`
                    p-3 rounded-xl text-left transition-all
                    ${selectedPerson === person.id
                      ? 'bg-signal-lime text-nightfall font-bold'
                      : 'bg-carbon/50 text-ash hover:bg-carbon'
                    }
                  `}
                >
                  <p className="text-sm font-semibold">{person.name}</p>
                  <p className="text-xs opacity-70">{person.campus}</p>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleVoteSubmit}
              disabled={!selectedPerson}
              className={`
                w-full font-bold text-sm px-6 py-3 rounded-xl transition-all
                ${selectedPerson
                  ? 'bg-gradient-to-r from-signal-lime to-electric-coral text-nightfall hover:scale-105 active:scale-95'
                  : 'bg-carbon/50 text-steel/50 cursor-not-allowed'
                }
              `}
            >
              {selectedPerson ? 'Submit Vote Anonymously' : 'Select Someone First'}
            </button>

            {/* Privacy Reminder */}
            <div className="bg-nightfall/50 border border-steel/20 rounded-xl p-3">
              <p className="text-xs text-steel text-center leading-relaxed">
                🔒 Your vote is 100% anonymous. They'll get a notification but won't know it was you!
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
