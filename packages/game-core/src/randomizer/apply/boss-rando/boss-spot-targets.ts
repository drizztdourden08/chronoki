/* @layer bridge-wasm @kind logic */
import type { EnemyField, EnemyStats } from '../enemy-table/enemy-table.type';
import type { EnemyTargets } from '../enemy-table/enemy-targets.type';
import type { BossAssignment, BossSpot } from './boss-rando.type';
import { BOSS_RATIO_FIELDS, BOSS_SPOT_FIELDS } from './boss-spot-stats.constants';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';

const targetOf = (spot: BossSpot, mover: BossSpot, byId: ReadonlyMap<number, EnemyStats>): Partial<Record<EnemyField, number>> | null => {
  const home = byId.get(spot.enemy)?.values;
  const own = byId.get(mover.enemy)?.values;
  if (!home || !own) return null;
  const ratio = own.level > 0 ? home.level / own.level : 1;
  const target: Partial<Record<EnemyField, number>> = {};
  BOSS_SPOT_FIELDS.forEach((field) => {
    target[field] = home[field];
  });
  BOSS_RATIO_FIELDS.forEach((field) => {
    target[field] = Math.round(own[field] * ratio);
  });
  return target;
};

const bossSpotTargets = (stats: readonly EnemyStats[], assignment: BossAssignment): EnemyTargets => {
  const byId = new Map(stats.map((e) => [e.id, e]));
  const spotOf = new Map(BOSS_RANDO_SPOTS.map((s) => [s.id, s]));
  const targets = new Map<number, Partial<Record<EnemyField, number>>>();
  BOSS_RANDO_SPOTS.forEach((spot) => {
    const mover = spotOf.get(assignment[spot.id] ?? spot.id);
    const target = mover && mover !== spot ? targetOf(spot, mover, byId) : null;
    if (mover && target) targets.set(mover.enemy, target);
  });
  return targets;
};

export { bossSpotTargets };
