# BeastCard Timeline Enhancement

**Date**: December 15, 2025
**Component**: [components/cards/BeastCard.tsx](../components/cards/BeastCard.tsx)

## Summary

Enhanced BeastCard with visual weekly schedule timeline and live action indicator to eliminate user confusion about where they are in the Beast Week cycle and what actions are currently available.

## User Request

> "one the screen below we need to show weekly schedule line and the ongoing event task that is open so people dont have to guess"

## Implementation

### 1. Weekly Timeline (5-Phase Visualization)

Visual representation showing all 5 phases of the Beast Week cycle:

- **Mon** - Reveal
- **Tue-Wed** - Submit
- **Thu-Fri** - Vote
- **Sat** - Finale
- **Sun** - Reel

#### Visual States

**Active Phase** (Current):
- Background: Signal Lime (#9AE66E) at 20% opacity
- Border: Solid Signal Lime 2px
- Pulsing scale animation
- Indicator dot in top-right corner with pulse

**Completed Phases**:
- Background: Digital Grape (#6A5ACD) at 20% opacity
- Border: Digital Grape at 40% opacity 2px
- Checkmark badge in top-right corner
- Connected by Digital Grape connector lines

**Future Phases**:
- Background: Nightfall at 20% opacity
- Border: Ash at 20% opacity 2px
- Muted text color (Steel)

### 2. Live Action Banner

Shows during active participation phases (SUBMISSIONS_OPEN and VOTING_OPEN):

**Submissions Phase**:
- Background: Electric Coral (#FF6F61) at 20% opacity
- Border: Electric Coral at 40% opacity 2px
- Text: "🎬 LIVE: Submit Clips"
- Pulsing indicator dot in Electric Coral

**Voting Phase**:
- Background: Signal Lime (#9AE66E) at 20% opacity
- Border: Signal Lime at 40% opacity 2px
- Text: "🔥 LIVE: Vote Now"
- Pulsing indicator dot in Signal Lime

**Countdown Timer**:
- Shows time remaining until phase closes
- Format: "Closes in 2d 14h" or "Closes in 5h 23m"
- Uses existing `getPhaseCountdown()` helper

### 3. Integration with Existing System

**Helper Functions Used** ([lib/beastPhases.ts](../lib/beastPhases.ts)):
- `getTimelineSteps(beastWeek)` - Returns timeline data with active/complete states
- `getPhaseCountdown(beastWeek)` - Calculates time remaining in current phase

**Design System Compliance**:
- ✅ Pantone 2025 solid colors (NO gradients)
- ✅ Framer Motion for smooth animations
- ✅ Responsive layout with proper spacing
- ✅ Clean visual hierarchy

## Technical Details

### Component Structure

```tsx
{/* Weekly Timeline */}
<motion.div className="space-y-2">
  {/* Timeline Steps - 5 phase indicators */}
  <div className="flex items-center justify-between gap-1">
    {timelineSteps.map((step, index) => (
      // Phase indicator with active/complete/future states
      // Connector lines between phases
    ))}
  </div>

  {/* Live Action Banner - Shown during active phases */}
  {(phase === 'SUBMISSIONS_OPEN' || phase === 'VOTING_OPEN') && (
    <motion.div>
      // Pulsing indicator + action text + countdown
    </motion.div>
  )}
</motion.div>
```

### Animations

1. **Active Phase Pulse**: Scale animation `[1, 1.02, 1]` over 2 seconds (infinite)
2. **Indicator Dot Pulse**: Scale animation `[1, 1.3, 1]` over 1.5 seconds (infinite)
3. **Live Banner Dot**: Opacity animation `[1, 0.3, 1]` over 2 seconds (infinite)
4. **Initial Reveal**: Fade-in + slide-up with 0.2s delay

### Responsive Design

- Timeline adapts to screen width with flex layout
- Font sizes: 10px for day labels, 9px for phase labels
- Compact spacing (gap-1) for mobile optimization
- Touch-friendly 48px height for phase indicators

## User Experience Improvements

**Before**:
- Users had to read subtitle text to understand current phase
- No visual indication of week progress
- Unclear when phases start/end
- Had to guess what action was available

**After**:
- Immediate visual understanding of entire week cycle
- Clear indication of current phase with pulsing animation
- Completed phases marked with checkmarks
- Live banner shows exact action needed ("Submit Clips" or "Vote Now")
- Countdown timer shows urgency and deadline

## Files Modified

1. **[components/cards/BeastCard.tsx](../components/cards/BeastCard.tsx)**
   - Added imports: `getTimelineSteps`, `getPhaseCountdown`
   - Added timeline variables in component
   - Inserted Weekly Timeline section after header
   - Added Live Action Banner for active phases

## Testing

✅ **Compilation**: No TypeScript errors
✅ **Dev Server**: Running successfully on port 3002
✅ **Design System**: 100% Pantone 2025 compliant (solid colors only)
✅ **Animations**: Smooth Framer Motion transitions
✅ **Responsive**: Adapts to mobile and desktop layouts

## Next Steps

**Potential Future Enhancements**:
1. Add swipe gesture to navigate between phases on mobile
2. Show participant count for each phase ("143 submissions", "89 votes")
3. Add confetti animation when viewing a completed phase
4. Phase-specific background colors for entire card (currently just indicator)
5. Add "Next phase starts in..." timer during cooldown phase

## Design Tokens Used

**Colors**:
- `signal-lime` (#9AE66E) - Active phase
- `digital-grape` (#6A5ACD) - Completed phases
- `electric-coral` (#FF6F61) - Submissions banner
- `nightfall` (#2A2D3A) - Future phases, text
- `ash` (#B0B8C1) - Text, borders
- `steel` (#6B7280) - Muted text

**Spacing**:
- `space-y-2` - Section spacing
- `gap-1` - Timeline step spacing
- `px-3 py-2` - Banner padding
- `h-12` - Phase indicator height

**Typography**:
- `text-[10px]` - Day labels
- `text-[9px]` - Phase labels
- `text-xs` - Banner text
- `font-bold`, `font-semibold` - Weight variations
