/* @layer bridge-wasm @kind constants @source Belthasar battle.c (C1/F205 tech pass, CC/276A, CC/2778, CC/1BEB) and menu.c (screen 3, FF/F82E) */
import type { RecordTable } from './tech-order.type';

const TECH_CHARACTERS = 7;
const TECH_SLOTS = 8;
const FIRST_TECH_ID = 1;
const LAST_TECH_ID = TECH_CHARACTERS * TECH_SLOTS;
const TECH_ORDER_STREAM = ':tech-order';
const FIELD_USABLE_TECH_IDS: readonly number[] = [0x09, 0x0c, 0x0f, 0x1a, 0x1d, 0x21, 0x24, 0x27, 0x29];

const CONTROL_TABLE: RecordTable = { rom: 0x0c1beb, size: 11 };
const CONTROL_COUNT = 0x7c;
const CONTROL_FIXED_BYTE = 0;
const CONTROL_EFFECT_BYTES: readonly number[] = [5, 6, 7];
const EFFECT_REF_MASK = 0x7f;
const EFFECT_REF_FLAG = 0x80;

const MOVED_TABLES: readonly RecordTable[] = [
  { rom: 0x0c213f, size: 12 },
  { rom: 0x0c253b, size: 1 },
  { rom: 0x0d45a6, size: 7 },
  { rom: 0x0c1acb, size: 2 },
  { rom: 0x0c15c4, size: 11 },
  { rom: 0x0c3a09, size: 2 },
  { rom: 0x0c2bdc, size: 1 },
];

const LEARN_REFS_ROM = 0x0c2778;
const LEARN_REF_BYTES = 5;
const LEARN_REF_LIMIT = 32;
const LEARN_REF_END = 0xff;
const LEARN_REQ_BYTES = 3;
const CC_BANK_ROM = 0x0c0000;
const MENU_MP_REQS_ROM = 0x0c28db;
const MENU_MP_REQS_BYTES = 0x87;

const CC_MENU_TABLE_NAME = 'ctRomCC';
const CC_MENU_TABLE_ROM = 0x0c0b5e;
const MP_COST_TABLE_NAME = 'ctTechMpCost';
const MP_INDEX_TABLE_NAME = 'ctTechMpIdx';
const DESC_TABLE_NAME = 'ctTechDesc';
const DESC_ROW_BYTES = 32;
const NAMED_TABLE_TYPE = 65;
const NAMED_TABLE_HEADER_BYTES = 16;

export {
  CC_BANK_ROM, CC_MENU_TABLE_NAME, CC_MENU_TABLE_ROM, CONTROL_COUNT, CONTROL_EFFECT_BYTES, CONTROL_FIXED_BYTE, CONTROL_TABLE,
  DESC_ROW_BYTES, DESC_TABLE_NAME, EFFECT_REF_FLAG, EFFECT_REF_MASK, FIELD_USABLE_TECH_IDS, FIRST_TECH_ID, LAST_TECH_ID,
  LEARN_REF_BYTES, LEARN_REF_END, LEARN_REF_LIMIT, LEARN_REFS_ROM, LEARN_REQ_BYTES, MENU_MP_REQS_BYTES, MENU_MP_REQS_ROM,
  MOVED_TABLES, MP_COST_TABLE_NAME, MP_INDEX_TABLE_NAME, NAMED_TABLE_HEADER_BYTES, NAMED_TABLE_TYPE, TECH_CHARACTERS,
  TECH_ORDER_STREAM, TECH_SLOTS,
};
