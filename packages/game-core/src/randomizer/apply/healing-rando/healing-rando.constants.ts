/* @layer bridge-wasm @kind constants @source Belthasar battle.c (CC/05CC) and menu.c (ctItemFxKind, ctItemFxAmt) */
const HEALING_RANDO_STREAM = ':healing-rando';
const HEAL_RECORD_ROM = 0x0c05cc;
const HEAL_RECORD_BYTES = 4;
const HEAL_RECORD_MULT_AT = 2;
const HEAL_RECORD_BASE_AT = 3;
const HEAL_FIRST_ID = 0xbc;
const HEAL_KIND_TABLE = 'ctItemFxKind';
const HEAL_AMOUNT_TABLE = 'ctItemFxAmt';
const HEAL_KIND_HP = 1;
const HEAL_KIND_MP = 2;
const HEAL_AMOUNT_LIMIT = 999;
const HEAL_BASE_LIMIT = 0xff;

export {
  HEAL_AMOUNT_LIMIT, HEAL_AMOUNT_TABLE, HEAL_BASE_LIMIT, HEAL_FIRST_ID, HEAL_KIND_HP, HEAL_KIND_MP, HEAL_KIND_TABLE,
  HEAL_RECORD_BASE_AT, HEAL_RECORD_BYTES, HEAL_RECORD_MULT_AT, HEAL_RECORD_ROM, HEALING_RANDO_STREAM,
};
