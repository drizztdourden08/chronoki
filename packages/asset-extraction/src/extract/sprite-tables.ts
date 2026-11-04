/* @layer shared-asset-extraction @kind logic @source Python sprites.parse_tables, sprites.read_sprite_palette */
import { getEntries2Byte } from './get-entries-2byte';
import { PTR_TABLE } from './sprite-tables.constants';

const spritePalettePtrs = (rom: Uint8Array): number[] => {
  const ptrs = getEntries2Byte(rom, PTR_TABLE, 7);
  return getEntries2Byte(rom, ptrs[4]!, 253);
};

export { spritePalettePtrs };
