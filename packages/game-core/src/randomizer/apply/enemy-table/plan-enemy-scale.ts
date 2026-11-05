/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { enemyFieldEdits } from './enemy-field-edits';
import type { EnemyField, EnemyStats } from './enemy-table.type';

const scaledEdits = (enemy: EnemyStats, field: EnemyField, factor: number): PackEdit[] =>
  enemy.values[field] === 0 ? [] : enemyFieldEdits(enemy, field, Math.round(enemy.values[field] * factor));

const planEnemyScale = (
  stats: readonly EnemyStats[],
  ids: readonly number[],
  factor: number,
  fields: readonly EnemyField[],
): PackEdit[] => {
  const wanted = new Set(ids);
  return stats.filter((e) => wanted.has(e.id)).flatMap((e) => fields.flatMap((f) => scaledEdits(e, f, factor)));
};

export { planEnemyScale };
