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
        {/* Progress Line - Solid background */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-steel/30" />
        <div
          className="absolute top-6 left-0 h-0.5 bg-digital-grape transition-all duration-500"
          style={{
            width: `${(steps.findIndex(s => s.isActive) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.phase} className="flex flex-col items-center">
              {/* Circle - Solid colors only */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${
                    step.isActive
                      ? 'bg-digital-grape ring-4 ring-digital-grape/30 scale-110 border-2 border-digital-grape/50'
                      : step.isComplete
                      ? 'bg-signal-lime border-2 border-signal-lime/30'
                      : 'bg-carbon border-2 border-steel/30'
                  }
                `}
              >
                {step.isComplete ? (
                  <span className="text-ash text-lg">✓</span>
                ) : step.isActive ? (
                  <span className="text-ash text-lg font-bold animate-pulse">●</span>
                ) : (
                  <span className="text-steel text-sm font-semibold">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <div
                  className={`
                    text-xs font-semibold
                    ${step.isActive ? 'text-digital-grape' : 'text-steel'}
                  `}
                >
                  {step.day}
                </div>
                <div
                  className={`
                    text-[10px]
                    ${step.isActive ? 'text-ash' : 'text-steel'}
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
