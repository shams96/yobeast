'use client';

import { getTimelineSteps, TimelineStep } from '@/lib/beastPhases';
import { BeastWeek } from '@/types';

interface BeastTimelineProps {
  beastWeek: BeastWeek;
}

export default function BeastTimeline({ beastWeek }: BeastTimelineProps) {
  const steps = getTimelineSteps(beastWeek);

  return (
    <div className="w-full px-6 py-4">
      {/* Timeline Container */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-dark-border" />
        <div
          className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-brand-pink to-brand-mocha transition-all duration-500"
          style={{
            width: `${(steps.findIndex(s => s.isActive) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.phase} className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    step.isActive
                      ? 'bg-gradient-to-br from-accent-fire to-brand-pink ring-4 ring-accent-fire/30 scale-110'
                      : step.isComplete
                      ? 'bg-brand-mocha'
                      : 'bg-dark-surface border-2 border-dark-border'
                  }
                `}
              >
                {step.isComplete ? (
                  <span className="text-white text-lg">✓</span>
                ) : step.isActive ? (
                  <span className="text-white text-lg font-bold animate-pulse">●</span>
                ) : (
                  <span className="text-text-tertiary text-sm font-semibold">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <div
                  className={`
                    text-xs font-semibold
                    ${step.isActive ? 'text-accent-fire' : 'text-text-tertiary'}
                  `}
                >
                  {step.day}
                </div>
                <div
                  className={`
                    text-[10px]
                    ${step.isActive ? 'text-text-primary' : 'text-text-tertiary'}
                  `}
                >
                  {step.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
