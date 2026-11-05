/* @layer bridge-wasm @kind constants */
import { SHEET_BASE, SHEET_STRIDE, WRAM_BANK_7F } from '../../game-info/wram-map.constants';

const MAGIC_GATE_AT = WRAM_BANK_7F + 0x01e0;
const MAGIC_GATE_BITS = 0x5f;
const TAUGHT_CHARACTERS: readonly number[] = [0, 1, 2, 4];
const TECH_LEVEL_AT = 0x2830;
const TECH_LEVEL = 3;
const TECH_BITS_AT = 0x2837;
const TECH_BITS = 0xe0;
const TP_NEXT_OFFSET = 0x2d;
const TP_NEXT_DEFAULT = 0x03a0;
const TP_NEXT_MARLE = 0x0396;
const MARLE = 1;

const tpNextAt = (id: number): number => SHEET_BASE + id * SHEET_STRIDE + TP_NEXT_OFFSET;
const tpNextOf = (id: number): number => (id === MARLE ? TP_NEXT_MARLE : TP_NEXT_DEFAULT);

export {
  MAGIC_GATE_AT, MAGIC_GATE_BITS, TAUGHT_CHARACTERS, TECH_BITS, TECH_BITS_AT, TECH_LEVEL, TECH_LEVEL_AT, tpNextAt, tpNextOf,
};
