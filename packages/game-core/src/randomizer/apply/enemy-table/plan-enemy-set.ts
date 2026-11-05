/* @layer bridge-wasm @kind logic */
import type { PackEdit } from '../apply-seed.type';
import { enemyFieldEdits } from './enemy-field-edits';
import type { EnemyField, EnemyStats } from './enemy-table.type';
import type { EnemyTargets } from './enemy-targets.type';

const planEnemySet = (stats: readonly EnemyStats[], targets: EnemyTargets): PackEdit[] =>
  stats.flatMap((enemy) => {
    const wanted = targets.get(enemy.id) ?? {};
    return (Object.keys(wanted) as EnemyField[]).flatMap((field) => enemyFieldEdits(enemy, field, wanted[field] ?? 0));
  });

export { planEnemySet };
