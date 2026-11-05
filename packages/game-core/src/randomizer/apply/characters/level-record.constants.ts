/* @layer bridge-wasm @kind constants @source Belthasar battle.c CtBattleLevelUp (ROM_HP_GROW, ROM_MP_GROW, ROM_STAT_RATE) */
const RECORD_BYTES = 0x50;
const OFF_MAX_HP = 0x05;
const OFF_MAX_MP = 0x09;
const OFF_LEVEL = 0x12;
const OFF_XP = 0x13;
const XP_BYTES = 3;
const OFF_NEXT = 0x2b;
const NEXT_BYTES = 2;
const OFF_CUR_HP = 0x03;
const OFF_CUR_MP = 0x07;
const MAX_HP = 999;
const MAX_MP = 99;
const MAX_STAT = 99;

const HP_GROW_ROM = 0x0c258a;
const MP_GROW_ROM = 0x0c25c2;
const STAT_RATE_ROM = 0x0c25fa;
const GROW_ROW_BYTES = 8;
const STAT_RATE_ROW_BYTES = 7;

type StatGrowth = { base: number; rate: number; current: number };

const STAT_GROWTH: readonly StatGrowth[] = [
  { base: 0x2f, rate: 0, current: 0x0b },
  { base: 0x30, rate: 1, current: 0x0c },
  { base: 0x32, rate: 3, current: 0x0f },
  { base: 0x33, rate: 4, current: 0x10 },
  { base: 0x34, rate: 5, current: 0x0e },
  { base: 0x35, rate: 6, current: 0x11 },
];

export type { StatGrowth };
export {
  GROW_ROW_BYTES, HP_GROW_ROM, MAX_HP, MAX_MP, MAX_STAT, MP_GROW_ROM, NEXT_BYTES, OFF_CUR_HP, OFF_CUR_MP, OFF_LEVEL, OFF_MAX_HP,
  OFF_MAX_MP, OFF_NEXT, OFF_XP, RECORD_BYTES, STAT_GROWTH, STAT_RATE_ROM, STAT_RATE_ROW_BYTES, XP_BYTES,
};
