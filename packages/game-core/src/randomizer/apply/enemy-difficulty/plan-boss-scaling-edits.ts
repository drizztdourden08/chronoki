/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { planEnemyScale } from '../enemy-table/plan-enemy-scale';
import { readEnemyStats } from '../enemy-table/read-enemy-stats';
import {
  BOSS_DEPTH_STEP, BOSS_FACTOR_CAP, BOSS_HP_FLOOR, BOSS_SCALED_FIELDS, BOSS_SPOTS,
} from './enemy-difficulty.constants';

const planBossScalingEdits = (pack: Uint8Array, depths: ReadonlyMap<string, number>): PackEdit[] => {
  const bosses = readEnemyStats(pack).filter((e) => e.values.hp >= BOSS_HP_FLOOR).sort((a, b) => a.values.hp - b.values.hp);
  return bosses.flatMap((boss, rank) => {
    const spot = BOSS_SPOTS[Math.floor((rank * BOSS_SPOTS.length) / bosses.length)];
    const depth = spot === undefined ? undefined : depths.get(spot);
    if (depth === undefined) return [];
    const factor = Math.min(BOSS_FACTOR_CAP, 1 + BOSS_DEPTH_STEP * depth);
    return planEnemyScale([boss], [boss.id], factor, BOSS_SCALED_FIELDS);
  });
};

export { planBossScalingEdits };
