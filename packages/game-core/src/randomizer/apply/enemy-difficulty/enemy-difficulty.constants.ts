/* @layer bridge-wasm @kind constants */
import type { EnemyField } from '../enemy-table/enemy-table.type';

const BOSS_HP_FLOOR = 1500;

const HARD_ENEMY_FACTORS: Readonly<Partial<Record<EnemyField, number>>> = {
  hp: 1.3, attack: 1.2, defense: 1.1, xp: 1.15, gold: 1.15,
};

const BOSS_SCALED_FIELDS: readonly EnemyField[] = ['hp', 'attack', 'defense'];
const BOSS_DEPTH_STEP = 0.08;
const BOSS_FACTOR_CAP = 2;

const BOSS_SPOTS: readonly string[] = [
  'ki-taban', 'ki-kings-trial', 'ki-mt-woe', 'ki-arris-dome', 'ki-frogs-burrow', 'ki-zenan-bridge',
  'ki-denadoro-mts', 'ki-sun-palace', 'ki-geno-dome', 'ki-sunken-desert', 'ki-giants-claw', 'ki-ozzies-fort',
  'ki-reptite-lair', 'ki-fionas-shrine',
];

export { BOSS_DEPTH_STEP, BOSS_FACTOR_CAP, BOSS_HP_FLOOR, BOSS_SCALED_FIELDS, BOSS_SPOTS, HARD_ENEMY_FACTORS };
