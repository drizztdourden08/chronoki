/* @layer bridge-wasm @kind type */
type EnemyField =
  | 'hp' | 'level' | 'stamina' | 'speed' | 'magic' | 'hit' | 'evade' | 'magicDefense' | 'attack' | 'defense'
  | 'xp' | 'gold' | 'tp';

type EnemyFieldSpec = { table: 'stats' | 'rewards'; offset: number; bytes: 1 | 2; min: number; max: number };

type EnemyStats = {
  id: number;
  values: Readonly<Record<EnemyField, number>>;
  statsAt: readonly number[];
  rewardsAt: readonly number[];
};

export type { EnemyField, EnemyFieldSpec, EnemyStats };
