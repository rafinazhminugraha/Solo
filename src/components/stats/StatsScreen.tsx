import { useState } from 'react';
import { useGameStore, useComputedStats } from '../../store/useGameStore';
import { getRankDefinition } from '../../lib/ranks';
import { QUEST_CATEGORIES, STAT_DEFINITIONS } from '../../constants/stats';
import { ACHIEVEMENT_DEFINITIONS } from '../../constants/achievements';
import { estimateDaysToNextLevel } from '../../lib/levels';
import { formatDisplayDate } from '../../lib/dates';
import { HunterCard } from '../dashboard/HunterCard';
import { RadarChart } from './RadarChart';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';

interface StatsScreenProps {
  onBack: () => void;
}

// Map achievement IDs to custom visual emojis
const ACHIEVEMENT_EMOJIS: Record<string, string> = {
  'A-01': '🩸', // First Blood
  'A-02': '🔰', // Initiated
  'A-03': '📅', // Week One
  'A-04': '🛣️', // The Long Road
  'A-05': '💯', // Century Mark
  'A-06': '✍️', // Reflective
  'A-07': '🧠', // Deep Thinker
  'A-08': '🛡️', // D-Rank Hunter
  'A-09': '⚔️', // Elite Hunter
  'A-10': '👑', // Sovereign
  'A-11': '💎', // Immortal
  'A-12': '⚡', // Comeback King
  'A-13': '⚙️', // Iron Will
  'A-14': '📈', // Stat Master
  'A-15': '⚖️', // Balanced Hunter
  'A-16': '⏳', // Year One
  'A-17': '❄️', // Frozen in Time
  'A-18': '🧊', // Ice Vault
  'A-19': '🎯', // The Why
  'A-20': '🌌', // Midnight Hunter
  'H-01': '👻', // Ghost Protocol (Hidden)
  'H-02': '⚒️', // The Grind (Hidden)
  'H-03': '⛰️', // Unmovable (Hidden)
  'H-04': '🐦', // Phoenix (Hidden)
  'H-05': '🌌', // Beyond Limits (Hidden)
};

export function StatsScreen({ onBack }: StatsScreenProps) {
  const quest = useGameStore((state) => state.quest);
  const streak = useGameStore((state) => state.streak);
  const earnedAchievements = useGameStore((state) => state.earnedAchievements);
  const updateQuestName = useGameStore((state) => state.updateQuestName);

  const stats = useComputedStats();
  const rankDef = getRankDefinition(stats.rank);
  const categoryDef = QUEST_CATEGORIES.find((c) => c.key === quest?.category) || {
    icon: '✦',
    label: quest?.category || 'Custom',
  };

  // Editing state for quest name
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(quest?.name || '');

  // Modal state for selected achievement details
  const [selectedAch, setSelectedAch] = useState<{
    name: string;
    description: string;
    emoji: string;
    xpReward: number;
    earnedAt: string | null;
  } | null>(null);

  // Calculate Avg XP/Day & Days to Level Up
  const avgXPPerDay = stats.totalDaysSinceStart > 0 ? stats.totalXP / stats.totalDaysSinceStart : 0;
  const daysToNextLevel = estimateDaysToNextLevel(stats.totalXP, avgXPPerDay);

  // List of stats tagged rows helper
  const getStatInfo = (key: string) => {
    return STAT_DEFINITIONS.find((d) => d.key === key) || { symbol: '✦', label: key };
  };

  return (
    <div className="flex-grow w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 font-[family-name:var(--font-body)]">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 select-none">
        <div className="flex flex-col gap-1 text-left">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider text-[var(--text-primary)]">
            STATS ANALYSIS
          </h2>
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
            LEVEL {stats.level} PROGRESSION
          </span>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      {/* 1. Hunter Card */}
      <HunterCard
        rankDef={rankDef}
        level={stats.level}
        questName={quest?.name || 'Daily Quest'}
        categoryIcon={categoryDef.icon}
        categoryLabel={categoryDef.label}
      />

      {/* 2. Stats Radar Section */}
      <Card elevated className="p-5 flex flex-col gap-4">
        <h3 className="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase text-left">
          YOUR BUILD
        </h3>
        
        {/* Radar Chart Component */}
        <RadarChart statPoints={stats.statPoints} />

        {/* Individual Stat points rows */}
        <div className="flex flex-col gap-1 mt-2">
          {Object.keys(stats.statPoints).map((key) => {
            const { symbol, label } = getStatInfo(key);
            const value = stats.statPoints[key as any] || 0;
            return (
              <div
                key={key}
                className="flex items-center justify-between text-xs font-[family-name:var(--font-mono)] py-1.5 uppercase font-semibold text-[var(--text-secondary)]"
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{symbol}</span>
                  <span className="tracking-wider">{label}</span>
                </span>
                <div className="flex-1 border-b border-dashed border-white/10 mx-3 h-0" />
                <span className="text-[var(--text-primary)] font-bold">{value}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 3. Lifetime Stats Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase text-left pl-1">
          LIFETIME STATS
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Total XP */}
          <Card className="p-4 flex flex-col gap-1 text-left bg-gradient-to-br from-[#12121A] to-[#161622]">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[var(--accent-primary)]">
              {stats.totalXP}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Total XP
            </span>
          </Card>

          {/* Total Check-ins */}
          <Card className="p-4 flex flex-col gap-1 text-left">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[var(--text-primary)]">
              {stats.totalCheckIns}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Total Check-ins
            </span>
          </Card>

          {/* Total Days Since Start */}
          <Card className="p-4 flex flex-col gap-1 text-left">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[var(--text-primary)]">
              {stats.totalDaysSinceStart}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Days Since Start
            </span>
          </Card>

          {/* Longest Streak */}
          <Card className="p-4 flex flex-col gap-1 text-left">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[#F59E0B]">
              {streak.longest}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Longest Streak
            </span>
          </Card>

          {/* Current Streak */}
          <Card className="p-4 flex flex-col gap-1 text-left">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[#F59E0B]">
              {streak.current}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Current Streak
            </span>
          </Card>

          {/* Avg XP/Day */}
          <Card className="p-4 flex flex-col gap-1 text-left">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[var(--text-primary)]">
              {avgXPPerDay.toFixed(1)}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Avg XP/Day
            </span>
          </Card>

          {/* Consistency Score */}
          <Card className="p-4 flex flex-col gap-1 text-left">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[var(--text-primary)]">
              {stats.consistencyScore}%
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Consistency Score
            </span>
          </Card>

          {/* Days to Level Up */}
          <Card className="p-4 flex flex-col gap-1 text-left col-span-2 md:col-span-1">
            <span className="font-[family-name:var(--font-mono)] text-xl font-black text-[var(--text-primary)]">
              {daysToNextLevel !== null ? `${daysToNextLevel} d` : 'Max'}
            </span>
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Days to Level {stats.level + 1}
            </span>
          </Card>
        </div>
      </div>

      {/* 4. Achievements Section */}
      <Card elevated className="p-5 flex flex-col gap-4">
        <h3 className="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase text-left">
          BADGES UNLOCKED ({earnedAchievements.length} / 25)
        </h3>

        {/* 5x5 Achievements Grid */}
        <div className="grid grid-cols-5 gap-3.5 my-2">
          {ACHIEVEMENT_DEFINITIONS.map((ach) => {
            const earned = earnedAchievements.find((ea) => ea.achievementId === ach.id);
            const isUnlocked = !!earned;
            const emoji = ACHIEVEMENT_EMOJIS[ach.id] || '🏆';

            // Click callback
            const handleBadgeClick = () => {
              if (isUnlocked) {
                setSelectedAch({
                  name: ach.name,
                  description: ach.description,
                  emoji,
                  xpReward: ach.xpReward,
                  earnedAt: earned ? formatDisplayDate(earned.earnedAt) : null,
                });
              } else if (!ach.hidden) {
                setSelectedAch({
                  name: ach.name,
                  description: ach.description,
                  emoji: '🔒',
                  xpReward: ach.xpReward,
                  earnedAt: null,
                });
              }
            };

            return (
              <button
                key={ach.id}
                type="button"
                onClick={handleBadgeClick}
                disabled={!isUnlocked && ach.hidden}
                className={[
                  'w-full aspect-square rounded-full flex items-center justify-center text-2xl select-none transition-all outline-none',
                  isUnlocked
                    ? 'bg-amber-500/10 border border-amber-500/35 hover:scale-105 hover:bg-amber-500/15 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : ach.hidden
                    ? 'bg-transparent border border-transparent'
                    : 'bg-white/5 border border-white/5 text-[var(--text-muted)] hover:bg-white/8 cursor-pointer text-xs font-bold font-[family-name:var(--font-mono)]',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`Achievement badge: ${isUnlocked ? ach.name : ach.hidden ? 'Hidden' : 'Locked'}`}
              >
                {isUnlocked ? (
                  emoji
                ) : ach.hidden ? (
                  '' // Blank if hidden and locked
                ) : (
                  '???' // ??? if locked and visible
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 5. Quest Details Section */}
      <Card elevated className="p-5 flex flex-col gap-4 text-left">
        <h3 className="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          QUEST DETAILS
        </h3>

        <div className="flex flex-col gap-4">
          {/* Inline editable quest name */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Quest Name
            </span>
            {isEditing ? (
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-[family-name:var(--font-body)]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    if (editedName.trim()) {
                      updateQuestName(editedName.trim());
                      setIsEditing(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-[var(--accent-primary)] text-black rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors cursor-pointer select-none"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedName(quest?.name || '');
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-[var(--text-secondary)] rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer select-none"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full bg-white/[0.02] border border-white/[0.04] px-3.5 py-2.5 rounded-xl">
                <span className="font-bold text-sm text-[var(--text-primary)] select-text">
                  {quest?.name || 'Daily Quest'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-white/5 rounded-lg text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer select-none outline-none"
                  aria-label="Edit Quest Name"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
              Category
            </span>
            <div className="text-sm font-semibold text-[var(--text-primary)] bg-white/[0.02] border border-white/[0.04] px-3.5 py-2.5 rounded-xl uppercase">
              {categoryDef.icon} {categoryDef.label}
            </div>
          </div>

          {/* Started On */}
          {quest?.createdAt && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
                Started On
              </span>
              <div className="text-sm font-semibold text-[var(--text-primary)] bg-white/[0.02] border border-white/[0.04] px-3.5 py-2.5 rounded-xl font-[family-name:var(--font-mono)]">
                {formatDisplayDate(quest.createdAt)}
              </div>
            </div>
          )}

          {/* Personal Why */}
          {quest?.why && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider">
                Your Why
              </span>
              <p className="text-xs italic text-[var(--text-secondary)] bg-white/[0.02] border border-white/[0.04] p-3.5 rounded-xl leading-relaxed select-text border-l-2 border-l-[var(--accent-primary)]">
                &ldquo;{quest.why}&rdquo;
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Mini-Modal details of clicked achievements */}
      <Modal
        isOpen={selectedAch !== null}
        onClose={() => setSelectedAch(null)}
        title="ACHIEVEMENT DETAILS"
      >
        {selectedAch && (
          <div className="flex flex-col items-center text-center gap-5 py-4 select-none font-[family-name:var(--font-body)]">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              {selectedAch.emoji}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-black text-[var(--accent-primary)] uppercase tracking-wider">
                {selectedAch.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-sm">
                {selectedAch.description}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl w-full">
              {selectedAch.earnedAt ? (
                <div>
                  Unlocked: <strong className="text-[var(--text-primary)]">{selectedAch.earnedAt}</strong>
                </div>
              ) : (
                <div className="text-[var(--text-muted)] font-semibold uppercase tracking-wider">Locked</div>
              )}
              <div className="mt-0.5">
                Reward:{' '}
                <strong className="text-[var(--accent-primary)]">
                  +{selectedAch.xpReward} XP
                </strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
