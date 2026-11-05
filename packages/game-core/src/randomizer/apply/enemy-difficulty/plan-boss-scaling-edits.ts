/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { planEnemyScale } from '../enemy-table/plan-enemy-scale';
import { readEnemyStats } from '../enemy-table/read-enemy-stats';
import { BOSS_SPOT_ENEMIES } from './boss-map.constants';
import { BOSS_DEPTH_STEP, BOSS_FACTOR_CAP, BOSS_SCALED_FIELDS } from './enemy-difficulty.constants';

const planBossScalingEdits = (pack: Uint8Array, depths: ReadonlyMap<string, number>): PackEdit[] => {
  const stats = readEnemyStats(pack);
  return Object.entries(BOSS_SPOT_ENEMIES).flatMap(([spot, ids]) => {
    const depth = depths.get(spot);
    if (depth === undefined) return [];
    const factor = Math.min(BOSS_FACTOR_CAP, 1 + BOSS_DEPTH_STEP * depth);
    return planEnemyScale(stats, ids, factor, BOSS_SCALED_FIELDS);
  });
};

export { planBossScalingEdits };
