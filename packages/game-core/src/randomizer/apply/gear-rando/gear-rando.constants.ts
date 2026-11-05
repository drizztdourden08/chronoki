/* @layer bridge-wasm @kind constants @source Belthasar battle.c FD/B033 (item id to the stat record in bank CC) */
const GEAR_RANDO_STREAM = ':gear-rando';
const GEAR_STAT_ROM: readonly number[] = [0x0c0262, 0x0c047e, 0x0c04e1];
const GEAR_STAT_STRIDE: readonly number[] = [5, 3, 3];
const GEAR_LAST_ID = 0x93;
const GEAR_CLASSES = 3;

export { GEAR_CLASSES, GEAR_LAST_ID, GEAR_RANDO_STREAM, GEAR_STAT_ROM, GEAR_STAT_STRIDE };
