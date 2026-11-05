/* @layer bridge-wasm @kind constants */
import type { EnemyField } from '../enemy-table/enemy-table.type';

const BOSS_HP_FLOOR = 1500;

const HARD_ENEMY_FACTORS: Readonly<Partial<Record<EnemyField, number>>> = {
  hp: 1.3, attack: 1.2, defense: 1.1, xp: 1.15, gold: 1.15,
};

const BOSS_SCALED_FIELDS: readonly EnemyField[] = ['hp', 'attack', 'defense'];
const BOSS_DEPTH_STEP = 0.08;
const BOSS_FACTOR_CAP = 2;

export { BOSS_DEPTH_STEP, BOSS_FACTOR_CAP, BOSS_HP_FLOOR, BOSS_SCALED_FIELDS, HARD_ENEMY_FACTORS };
