import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameStore, useComputedStats } from './useGameStore';

describe('Zustand GameStore Integration Tests', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.getState().fullReset();
    });
  });

  // 1. Initial State
  it('Initial State: hasCompletedOnboarding === false, quest === null', () => {
    const { result } = renderHook(() => useComputedStats());
    const state = useGameStore.getState();

    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.quest).toBeNull();
    expect(state.checkIns).toEqual([]);
    expect(state.streak.current).toBe(0);
    expect(result.current.totalXP).toBe(0);
    expect(result.current.level).toBe(1);
    expect(result.current.rank).toBe('E');
  });

  // 2. After completeOnboarding
  it('After completeOnboarding: quest is set, hasCompletedOnboarding === true', () => {
    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Focus study',
        category: 'mind',
        why: null,
      });
    });

    const state = useGameStore.getState();
    expect(state.hasCompletedOnboarding).toBe(true);
    expect(state.quest?.name).toBe('Focus study');
    expect(state.quest?.category).toBe('mind');
    expect(state.quest?.why).toBeNull();
    expect(state.bonusXPEvents).toEqual([]);
  });

  // 3. completeOnboarding with why
  it('completeOnboarding with why: totalXP from useComputedStats() includes the 25 bonus', () => {
    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Strength training',
        category: 'body',
        why: 'To feel energized every day',
      });
    });

    const state = useGameStore.getState();
    const { result } = renderHook(() => useComputedStats());

    // Awards 25 XP for setting why + 25 XP for unlocking achievement A-19 = 50 XP
    expect(state.bonusXPEvents.some((e) => e.xp === 25 && e.type === 'first_checkin')).toBe(true);
    expect(state.earnedAchievements.some((a) => a.achievementId === 'A-19')).toBe(true);
    expect(result.current.totalXP).toBe(50);
  });

  // 4. performCheckIn
  it('performCheckIn: check-in added to checkIns array, streak increments', () => {
    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Focus study',
        category: 'mind',
        why: null,
      });
    });

    act(() => {
      useGameStore.getState().performCheckIn('Completed task A', ['focus']);
    });

    const state = useGameStore.getState();
    const { result } = renderHook(() => useComputedStats());

    expect(state.checkIns.length).toBe(1);
    const firstCheckIn = state.checkIns[0]!;
    expect(firstCheckIn.note).toBe('Completed task A');
    expect(firstCheckIn.statsTagged).toEqual(['focus']);
    expect(state.streak.current).toBe(1);
    expect(result.current.totalCheckIns).toBe(1);
  });

  // 5. Idempotency
  it('Idempotency: calling performCheckIn twice on same day does not add a second check-in', () => {
    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Focus study',
        category: 'mind',
        why: null,
      });
    });

    act(() => {
      useGameStore.getState().performCheckIn('First call', ['focus']);
    });

    const checkInsAfterFirst = useGameStore.getState().checkIns.length;

    act(() => {
      useGameStore.getState().performCheckIn('Second call', ['focus']);
    });

    const checkInsAfterSecond = useGameStore.getState().checkIns.length;

    expect(checkInsAfterFirst).toBe(1);
    expect(checkInsAfterSecond).toBe(1);
  });

  // 6. XP never goes down
  it('XP never goes down: after any action, totalXP from previous state is always <= new totalXP', () => {
    let previousXP = renderHook(() => useComputedStats()).result.current.totalXP;

    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Run daily',
        category: 'body',
        why: 'Get fit',
      });
    });

    let currentXP = renderHook(() => useComputedStats()).result.current.totalXP;
    expect(previousXP).toBeLessThanOrEqual(currentXP);
    previousXP = currentXP;

    act(() => {
      useGameStore.getState().performCheckIn('Did a run!', ['endurance']);
    });

    currentXP = renderHook(() => useComputedStats()).result.current.totalXP;
    expect(previousXP).toBeLessThanOrEqual(currentXP);
    previousXP = currentXP;

    act(() => {
      useGameStore.setState({
        streak: {
          current: 1,
          longest: 1,
          lastCheckInDate: '2026-05-17',
          freezesAvailable: 1,
          freezesUsed: 0,
          freezeActivatedForDate: null,
          inComebackMode: false,
          comebackDaysRemaining: 0,
        },
      });
    });

    act(() => {
      useGameStore.getState().activateFreeze();
    });

    currentXP = renderHook(() => useComputedStats()).result.current.totalXP;
    expect(previousXP).toBeLessThanOrEqual(currentXP);
  });

  // 7. Level-up detection
  it('Level-up detection: mock enough XP that a level-up occurs, verify pendingCeremony is set', () => {
    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Workouts',
        category: 'body',
        why: null,
      });
    });

    // Mock 340 XP (just under Level 2 requirement of 348 XP)
    act(() => {
      useGameStore.setState({
        bonusXPEvents: [{ type: 'achievement', label: 'Base XP gift', xp: 340 }],
      });
    });

    // Perform check-in: awards XP pushing total above 348 XP
    act(() => {
      useGameStore.getState().performCheckIn(null, ['vitality']);
    });

    const state = useGameStore.getState();
    expect(state.pendingCeremony).not.toBeNull();
    expect(state.pendingCeremony?.type).toBe('level_up');
    expect(state.pendingCeremony?.previousValue).toBe(1);
    expect(state.pendingCeremony?.newValue).toBe(2);
  });

  // 8. clearPendingCeremony
  it('clearPendingCeremony: sets pendingCeremony back to null', () => {
    act(() => {
      useGameStore.setState({
        pendingCeremony: {
          type: 'level_up',
          previousValue: 1,
          newValue: 2,
          xpGained: 100,
        },
      });
    });

    expect(useGameStore.getState().pendingCeremony).not.toBeNull();

    act(() => {
      useGameStore.getState().clearPendingCeremony();
    });

    expect(useGameStore.getState().pendingCeremony).toBeNull();
  });

  // 9. activateFreeze
  it('activateFreeze: decrements freezesAvailable by 1, increments freezesUsed', () => {
    act(() => {
      useGameStore.setState({
        streak: {
          current: 4,
          longest: 4,
          lastCheckInDate: '2026-05-17',
          freezesAvailable: 2,
          freezesUsed: 1,
          freezeActivatedForDate: null,
          inComebackMode: false,
          comebackDaysRemaining: 0,
        },
      });
    });

    act(() => {
      useGameStore.getState().activateFreeze();
    });

    const state = useGameStore.getState();
    expect(state.streak.freezesAvailable).toBe(1);
    expect(state.streak.freezesUsed).toBe(2);
    expect(state.streak.freezeActivatedForDate).toBe('2026-05-18');
  });

  // 10. fullReset
  it('fullReset: returns to initial state', () => {
    act(() => {
      useGameStore.getState().completeOnboarding({
        name: 'Workouts',
        category: 'body',
        why: 'Stay healthy',
      });
    });

    act(() => {
      useGameStore.getState().performCheckIn('Day 1 done', ['vitality']);
    });

    act(() => {
      useGameStore.getState().fullReset();
    });

    const state = useGameStore.getState();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.quest).toBeNull();
    expect(state.checkIns).toEqual([]);
    expect(state.streak.current).toBe(0);
    expect(state.bonusXPEvents).toEqual([]);
  });
});
