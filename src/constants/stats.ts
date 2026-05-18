import { StatKey, QuestCategory } from '../store/types';

export interface StatDefinition {
  readonly key: StatKey;
  readonly label: string;
  readonly symbol: string;
  readonly description: string;
  readonly exampleQuests: readonly string[];
}

export interface QuestCategoryDefinition {
  readonly key: QuestCategory;
  readonly label: string;
  readonly icon: string;
  readonly color: string;
}

export const STAT_DEFINITIONS: readonly StatDefinition[] = [
  {
    key: 'focus',
    label: 'FOCUS',
    symbol: '🧠',
    description: 'Mental clarity, depth of attention',
    exampleQuests: ['Meditation', 'Deep work', 'Reading'],
  },
  {
    key: 'discipline',
    label: 'DISCIPLINE',
    symbol: '⚔️',
    description: 'Showing up regardless of mood',
    exampleQuests: ['Gym', 'Cold shower', 'Journaling'],
  },
  {
    key: 'endurance',
    label: 'ENDURANCE',
    symbol: '🔥',
    description: 'Physical and mental stamina',
    exampleQuests: ['Running', 'Fasting', 'Studying'],
  },
  {
    key: 'wisdom',
    label: 'WISDOM',
    symbol: '📖',
    description: 'Knowledge accumulation, skill',
    exampleQuests: ['Language learning', 'Coding', 'Writing'],
  },
  {
    key: 'vitality',
    label: 'VITALITY',
    symbol: '💎',
    description: 'Energy, health, recovery',
    exampleQuests: ['Sleep tracking', 'Nutrition', 'Stretching'],
  },
];

export const QUEST_CATEGORIES: readonly QuestCategoryDefinition[] = [
  {
    key: 'mind',
    label: 'Mind',
    icon: '🧠',
    color: '#3B82F6', // Blue
  },
  {
    key: 'body',
    label: 'Body',
    icon: '⚔️',
    color: '#22C55E', // Green
  },
  {
    key: 'skill',
    label: 'Skill',
    icon: '📖',
    color: '#A855F7', // Purple
  },
  {
    key: 'create',
    label: 'Create',
    icon: '🔥',
    color: '#F97316', // Orange
  },
  {
    key: 'health',
    label: 'Health',
    icon: '💎',
    color: '#EF4444', // Red
  },
  {
    key: 'custom',
    label: 'Custom',
    icon: '✦',
    color: '#6B7280', // Gray
  },
];
