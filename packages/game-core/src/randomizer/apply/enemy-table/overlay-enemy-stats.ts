/* @layer bridge-wasm @kind logic */
import { clampEnemyField } from './clamp-enemy-field';
import type { EnemyField, EnemyStats } from './enemy-table.type';
import type { EnemyTargets } from './enemy-targets.type';

const overlayEnemyStats = (stats: readonly EnemyStats[], targets: EnemyTargets): EnemyStats[] =>
  stats.map((enemy) => {
    const wanted = targets.get(enemy.id);
    if (!wanted) return enemy;
    const values = { ...enemy.values };
    (Object.keys(wanted) as EnemyField[]).forEach((field) => {
      values[field] = clampEnemyField(field, wanted[field] ?? 0);
    });
    return { ...enemy, values };
  });

export { overlayEnemyStats };
