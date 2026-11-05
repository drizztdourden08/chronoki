/* @layer bridge-wasm @kind logic */
import type { BossAssignment } from '../apply/boss-rando/boss-rando.type';
import { BOSS_RANDO_SPOTS } from '../apply/boss-rando/boss-spots.constants';

const bossRowsOf = (bosses: BossAssignment | undefined): { label: string; value: string }[] => {
  if (bosses === undefined) return [];
  const nameOf = new Map(BOSS_RANDO_SPOTS.map((spot) => [spot.id, spot.name]));
  return BOSS_RANDO_SPOTS.map((spot) => ({
    label: `Boss at ${spot.name}`,
    value: nameOf.get(bosses[spot.id] ?? spot.id) ?? spot.name,
  }));
};

export { bossRowsOf };
