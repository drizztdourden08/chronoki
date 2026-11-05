/* @layer bridge-wasm @kind logic */
import { BOSS_SPOT_ENEMIES } from '../enemy-difficulty/boss-map.constants';
import type { BossAssignment } from './boss-rando.type';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';

const bossSpotEnemiesOf = (assignment: BossAssignment): Readonly<Record<string, readonly number[]>> => {
  const enemyOf = new Map(BOSS_RANDO_SPOTS.map((s) => [s.id, s.enemy]));
  const moved = new Map<number, number>();
  BOSS_RANDO_SPOTS.forEach((spot) => {
    const enemy = enemyOf.get(assignment[spot.id] ?? spot.id);
    if (enemy !== undefined && spot.checkSpot !== undefined) moved.set(spot.enemy, enemy);
  });
  return Object.fromEntries(
    Object.entries(BOSS_SPOT_ENEMIES).map(([spot, ids]) => [spot, [...new Set(ids.map((id) => moved.get(id) ?? id))]]),
  );
};

export { bossSpotEnemiesOf };
