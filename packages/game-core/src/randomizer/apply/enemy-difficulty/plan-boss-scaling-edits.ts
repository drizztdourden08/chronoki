/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import type { EnemyStats } from '../enemy-table/enemy-table.type';
import { planEnemyScale } from '../enemy-table/plan-enemy-scale';
import { readEnemyStats } from '../enemy-table/read-enemy-stats';
import { BOSS_SPOT_ENEMIES } from './boss-map.constants';
import { BOSS_DEPTH_STEP, BOSS_FACTOR_CAP, BOSS_SCALED_FIELDS } from './enemy-difficulty.constants';

const planBossScalingEdits = (
  pack: Uint8Array,
  depths: ReadonlyMap<string, number>,
  spotEnemies: Readonly<Record<string, readonly number[]>> = BOSS_SPOT_ENEMIES,
  stats: readonly EnemyStats[] = readEnemyStats(pack),
): PackEdit[] =>
  Object.entries(spotEnemies).flatMap(([spot, ids]) => {
    const depth = depths.get(spot);
    if (depth === undefined) return [];
    const factor = Math.min(BOSS_FACTOR_CAP, 1 + BOSS_DEPTH_STEP * depth);
    return planEnemyScale(stats, ids, factor, BOSS_SCALED_FIELDS);
  });

export { planBossScalingEdits };
