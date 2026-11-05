/* @layer bridge-wasm @kind constants */
const TAB_VANILLA_AMOUNT = 1;
const TAB_MAX_AMOUNT = 9;
const TAB_AMOUNT_STREAM = ':tab-amounts';
const TAB_FILLER_STREAM = ':tab-filler';
const TAB_ROM_IDS = { power: 0xcd, magic: 0xce, speed: 0xcf } as const;
const TAB_FILLER_IDS: readonly number[] = [TAB_ROM_IDS.power, TAB_ROM_IDS.magic, TAB_ROM_IDS.speed];

export { TAB_AMOUNT_STREAM, TAB_FILLER_IDS, TAB_FILLER_STREAM, TAB_MAX_AMOUNT, TAB_ROM_IDS, TAB_VANILLA_AMOUNT };
