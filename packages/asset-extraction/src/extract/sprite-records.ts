/* @layer shared-asset-extraction @kind logic @source Python sprites.parse_tables, sprites.read_header, sprites.read_sprite_graphics, sprites.read_sprite_palette */
import { itemAt } from './bytes/item-at';
import { getEntries2Byte } from './get-entries-2byte';
import { getEntries3Byte } from './rom-read';
import { PTR_TABLE } from './sprite-records.constants';
import type { SpriteTables } from './sprite-records.type';

const tablesCache = new WeakMap<Uint8Array, SpriteTables>();

const parseTables = (rom: Uint8Array): SpriteTables => {
  const hit = tablesCache.get(rom);
  if (hit) return hit;
  const ptrs = getEntries2Byte(rom, PTR_TABLE, 7);
  const tables = {
    gfxPtrs: getEntries3Byte(rom, itemAt(ptrs, 0), 248),
    asmPtrs: getEntries3Byte(rom, itemAt(ptrs, 1), 231),
    palPtrs: getEntries2Byte(rom, itemAt(ptrs, 4), 253),
  };
  tablesCache.set(rom, tables);
  return tables;
};

export { parseTables };
export type { SpriteHeader, SpriteTables };
