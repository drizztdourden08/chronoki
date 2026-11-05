/* @layer bridge-wasm @kind type */
import type { EnemyField } from './enemy-table.type';

type EnemyTargets = ReadonlyMap<number, Readonly<Partial<Record<EnemyField, number>>>>;

export type { EnemyTargets };
