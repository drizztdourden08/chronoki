/* @layer shared-asset-extraction @kind logic */
import { ASM3_PTRS, ASM_PTRS, MAP_PTRS, TS_PTRS } from './asset-types.constants';
import { getEntries3Byte } from './rom-read';
import { scanSpriteUsage } from './scan-sprite-usage';
import type { PackTables } from './extract.type';

/** extract_assets.build() prelude: the pointer tables `T`, and the sprites the scene scripts use. */
const buildPackTables = (rom: Uint8Array): PackTables => ({
  mapPtrs: getEntries3Byte(rom, MAP_PTRS, 202),
  tsGfx: getEntries3Byte(rom, TS_PTRS, 204),
  asmPtrs: getEntries3Byte(rom, ASM_PTRS, 64),
  asm3Ptrs: getEntries3Byte(rom, ASM3_PTRS, 19),
  ...scanSpriteUsage(rom),
});

export { buildPackTables };
