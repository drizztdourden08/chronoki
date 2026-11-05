/* @layer bridge-wasm @kind logic */
import { ENEMY_FIELD_SPECS } from './enemy-table.constants';
import type { EnemyField } from './enemy-table.type';

const clampEnemyField = (field: EnemyField, value: number): number => {
  const spec = ENEMY_FIELD_SPECS[field];
  return Math.min(spec.max, Math.max(spec.min, value));
};

export { clampEnemyField };
