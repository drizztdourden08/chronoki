/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { clampEnemyField } from './clamp-enemy-field';
import { ENEMY_FIELD_SPECS } from './enemy-table.constants';
import type { EnemyField, EnemyStats } from './enemy-table.type';

const enemyFieldEdits = (enemy: EnemyStats, field: EnemyField, wanted: number): PackEdit[] => {
  const spec = ENEMY_FIELD_SPECS[field];
  const old = enemy.values[field];
  const next = clampEnemyField(field, wanted);
  if (next === old) return [];
  const bases = spec.table === 'stats' ? enemy.statsAt : enemy.rewardsAt;
  const why = `enemy-${enemy.id}-${field}`;
  return bases.flatMap((base) => {
    const at = base + spec.offset;
    const low = { at, old: old & 0xff, next: next & 0xff, why };
    return spec.bytes === 2 ? [low, { at: at + 1, old: old >> 8, next: next >> 8, why }] : [low];
  });
};

export { enemyFieldEdits };
