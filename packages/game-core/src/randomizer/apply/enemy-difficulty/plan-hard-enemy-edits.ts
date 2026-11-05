/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import type { EnemyField } from '../enemy-table/enemy-table.type';
import { planEnemyScale } from '../enemy-table/plan-enemy-scale';
import { readEnemyStats } from '../enemy-table/read-enemy-stats';
import { BOSS_HP_FLOOR, HARD_ENEMY_FACTORS } from './enemy-difficulty.constants';

const planHardEnemyEdits = (pack: Uint8Array): PackEdit[] => {
  const stats = readEnemyStats(pack);
  const regular = stats.filter((e) => e.values.hp > 0 && e.values.hp < BOSS_HP_FLOOR).map((e) => e.id);
  const fields = Object.keys(HARD_ENEMY_FACTORS) as EnemyField[];
  return fields.flatMap((field) => planEnemyScale(stats, regular, HARD_ENEMY_FACTORS[field] ?? 1, [field]));
};

export { planHardEnemyEdits };
