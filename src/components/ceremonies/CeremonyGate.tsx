import { useGameStore } from '../../store/useGameStore';
import { LevelUpCeremony } from './LevelUpCeremony';
import { RankUpCeremony } from './RankUpCeremony';

export function CeremonyGate() {
  const pendingCeremony = useGameStore((state) => state.pendingCeremony);

  if (!pendingCeremony) {
    return null;
  }

  if (pendingCeremony.type === 'level_up') {
    return <LevelUpCeremony />;
  }

  if (pendingCeremony.type === 'rank_up') {
    return <RankUpCeremony />;
  }

  return null;
}
