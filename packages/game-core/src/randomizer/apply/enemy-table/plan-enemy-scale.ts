/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { ENEMY_FIELD_SPECS } from './enemy-table.constants';
import type { EnemyField, EnemyStats } from './enemy-table.type';

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

const fieldEdits = (enemy: EnemyStats, field: EnemyField, factor: number): PackEdit[] => {
  const spec = ENEMY_FIELD_SPECS[field];
  const old = enemy.values[field];
  const next = clamp(Math.round(old * factor), spec.min, spec.max);
  if (next === old) return [];
  const bases = spec.table === 'stats' ? enemy.statsAt : enemy.rewardsAt;
  const why = `enemy-${enemy.id}-${field}`;
  return bases.flatMap((base) => {
    const at = base + spec.offset;
    const low = { at, old: old & 0xff, next: next & 0xff, why };
    return spec.bytes === 2 ? [low, { at: at + 1, old: old >> 8, next: next >> 8, why }] : [low];
  });
};

const planEnemyScale = (
  stats: readonly EnemyStats[],
  ids: readonly number[],
  factor: number,
  fields: readonly EnemyField[],
): PackEdit[] => {
  const wanted = new Set(ids);
  return stats.filter((e) => wanted.has(e.id)).flatMap((e) => fields.flatMap((f) => fieldEdits(e, f, factor)));
};

export { planEnemyScale };
