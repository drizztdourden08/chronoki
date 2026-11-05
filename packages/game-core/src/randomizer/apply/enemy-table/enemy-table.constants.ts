/* @layer bridge-wasm @kind constants @source Belthasar disasm notes battle_boot.md (FD:B438, $CC:4700 + id*23) and battle_results_window.md (P2.1, $CC:5E00 + id*7) */
import type { EnemyField, EnemyFieldSpec } from './enemy-table.type';

const ENEMY_COUNT = 256;
const STATS_ROM = 0x0c4700;
const STATS_RECORD_BYTES = 23;
const REWARDS_ROM = 0x0c5e00;
const REWARDS_RECORD_BYTES = 7;

const ENEMY_FIELD_SPECS: Readonly<Record<EnemyField, EnemyFieldSpec>> = {
  hp: { table: 'stats', offset: 0, bytes: 2, min: 1, max: 0xffff },
  level: { table: 'stats', offset: 2, bytes: 1, min: 1, max: 99 },
  stamina: { table: 'stats', offset: 8, bytes: 1, min: 0, max: 0xff },
  speed: { table: 'stats', offset: 9, bytes: 1, min: 0, max: 0xff },
  magic: { table: 'stats', offset: 10, bytes: 1, min: 0, max: 0xff },
  hit: { table: 'stats', offset: 11, bytes: 1, min: 0, max: 0xff },
  evade: { table: 'stats', offset: 12, bytes: 1, min: 0, max: 0xff },
  magicDefense: { table: 'stats', offset: 13, bytes: 1, min: 0, max: 0xff },
  attack: { table: 'stats', offset: 14, bytes: 1, min: 0, max: 0xff },
  defense: { table: 'stats', offset: 15, bytes: 1, min: 0, max: 0xff },
  xp: { table: 'rewards', offset: 0, bytes: 2, min: 0, max: 0xffff },
  gold: { table: 'rewards', offset: 2, bytes: 2, min: 0, max: 0xffff },
  tp: { table: 'rewards', offset: 6, bytes: 1, min: 0, max: 0xff },
};

export { ENEMY_COUNT, ENEMY_FIELD_SPECS, REWARDS_RECORD_BYTES, REWARDS_ROM, STATS_RECORD_BYTES, STATS_ROM };
