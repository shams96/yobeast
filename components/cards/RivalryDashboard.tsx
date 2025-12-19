'use client';

import { CampusStats } from '@/types';
import { motion } from 'framer-motion';

interface RivalryDashboardProps {
  campusStats: Record<string, CampusStats>;
  userCampusId: string;
}

export default function RivalryDashboard({ campusStats, userCampusId }: RivalryDashboardProps) {
  const userCampus = campusStats[userCampusId];

  if (!userCampus) {
    return null;
  }

  // Get top 3 campuses by power ranking
  const rankedCampuses = Object.values(campusStats)
    .sort((a, b) => b.powerRanking - a.powerRanking)
    .slice(0, 3);

  // Get user's rivalries
  const rivalries = Object.entries(userCampus.rivalryRecord || {}).map(([rivalId, record]) => ({
    rival: campusStats[rivalId],
    record,
  }));

  return (
    <motion.div
      className="w-full px-4 py-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="text-lg font-black text-ash">Campus Rivalry</h3>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-signal-lime/20 border border-signal-lime/40">
            <span className="text-xs font-bold text-nightfall">
              #{userCampus.nationalRank} Nationally
            </span>
          </div>
        </div>

        {/* Your Campus Stats */}
        <motion.div
          className="p-4 rounded-2xl bg-gradient-to-br from-digital-grape to-future-dusk border-2 border-digital-grape/40"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="text-xs font-semibold text-ash/80 uppercase tracking-wide mb-1">
                Your Campus
              </div>
              <div className="text-xl font-black text-ash mb-1">
                {userCampus.campusName}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ash/90">{userCampus.mascot}</span>
                <div className="flex gap-1">
                  {userCampus.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-3 h-3 rounded-full border border-ash/30"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-signal-lime">
                {userCampus.powerRanking}
              </div>
              <div className="text-xs text-ash/80">Power Rating</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg bg-nightfall/40">
              <div className="text-lg font-bold text-ash">{userCampus.totalBeastWins}</div>
              <div className="text-[10px] text-ash/70 uppercase tracking-wide">Wins</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-nightfall/40">
              <div className="text-lg font-bold text-ash">{userCampus.currentStreak}</div>
              <div className="text-[10px] text-ash/70 uppercase tracking-wide">Streak</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-nightfall/40">
              <div className="text-lg font-bold text-ash">{userCampus.beastSubmissions}</div>
              <div className="text-[10px] text-ash/70 uppercase tracking-wide">Submissions</div>
            </div>
          </div>
        </motion.div>

        {/* National Rankings */}
        <div className="p-4 rounded-2xl bg-carbon border border-steel/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📊</span>
            <h4 className="text-sm font-bold text-ash">National Power Rankings</h4>
          </div>
          <div className="space-y-2">
            {rankedCampuses.map((campus, idx) => (
              <motion.div
                key={campus.campusId}
                className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
                  campus.campusId === userCampusId
                    ? 'bg-signal-lime/20 border border-signal-lime/40'
                    : 'bg-nightfall/40 border border-ash/20'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`text-lg font-black ${
                    idx === 0 ? 'text-signal-lime' : idx === 1 ? 'text-ash' : 'text-steel'
                  }`}>
                    #{campus.nationalRank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-ash truncate">
                      {campus.campusName}
                    </div>
                    <div className="text-xs text-ash/70">{campus.mascot}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-ash">{campus.powerRanking}</div>
                  <div className="text-[10px] text-ash/60">Power</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Head-to-Head Rivalries */}
        {rivalries.length > 0 && (
          <div className="p-4 rounded-2xl bg-carbon border border-steel/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⚔️</span>
              <h4 className="text-sm font-bold text-ash">Head-to-Head Records</h4>
            </div>
            <div className="space-y-2">
              {rivalries.map(({ rival, record }, idx) => {
                if (!rival) return null;
                const winPercentage = (record.wins / (record.wins + record.losses)) * 100;

                return (
                  <motion.div
                    key={rival.campusId}
                    className="p-3 rounded-lg bg-nightfall/40 border border-ash/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="text-sm font-bold text-ash">{rival.campusName}</div>
                        <div className="text-xs text-ash/70">{rival.mascot}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-base font-black ${
                          record.wins > record.losses ? 'text-signal-lime' : 'text-electric-coral'
                        }`}>
                          {record.allTimeRecord}
                        </div>
                        <div className="text-[10px] text-ash/60">All-Time</div>
                      </div>
                    </div>

                    {/* Win Percentage Bar */}
                    <div className="w-full h-1.5 rounded-full bg-steel/30 overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          winPercentage >= 50 ? 'bg-signal-lime' : 'bg-electric-coral'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${winPercentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 + 0.2 }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-ash/60">You: {record.wins}W</span>
                      <span className="text-[10px] text-ash/60">Them: {record.losses}L</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* This Week's Activity */}
        <div className="p-4 rounded-2xl bg-carbon border border-steel/30">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📈</span>
            <h4 className="text-sm font-bold text-ash">This Week's Activity</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-nightfall/40 border border-ash/20">
              <div className="text-xl font-black text-signal-lime">
                {userCampus.weeklyParticipation}
              </div>
              <div className="text-[10px] text-ash/70 uppercase tracking-wide mt-1">
                Students Active
              </div>
            </div>
            <div className="p-3 rounded-lg bg-nightfall/40 border border-ash/20">
              <div className="text-xl font-black text-electric-coral">
                {userCampus.totalVotes.toLocaleString()}
              </div>
              <div className="text-[10px] text-ash/70 uppercase tracking-wide mt-1">
                Total Votes Cast
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
