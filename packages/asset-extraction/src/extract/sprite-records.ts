/* @layer shared-asset-extraction @kind logic @source Python sprites.parse_tables, sprites.read_header, sprites.read_sprite_graphics, sprites.read_sprite_palette */
import { byteAt, itemAt, wordAt } from './bytes/byte-reader';
import { getEntries2Byte, getEntries3Byte } from './rom-read';
import { lzDecompress } from './lz-decompress';
import { snes15ToRgb } from './snes-color';
import { HEADER_BASE, PTR_TABLE, ENEMY_RECORDS } from './sprite-records.constants';
import type { SpriteHeader, SpriteTables } from './sprite-records.type';

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

const readHeader = (rom: Uint8Array, index: number): SpriteHeader => {
  const o = index >= 0x100 ? ENEMY_RECORDS + (index - 0x100) * 10 : HEADER_BASE + index * 5;
  return {
    bitmap: byteAt(rom, o),
    assembly: byteAt(rom, o + 1),
    palette: byteAt(rom, o + 2),
    anim: byteAt(rom, o + 3),
    size: byteAt(rom, o + 4),
  };
};

const readSpriteGraphics = (rom: Uint8Array, gfxPtrs: number[], bitmapIndex: number): Uint8Array => {
  const off = itemAt(gfxPtrs, bitmapIndex);
  if (bitmapIndex <= 6) {
    const hi = gfxPtrs.filter((p) => p > off);
    const size = Math.min(0x8000, hi.length > 0 ? Math.min(...hi) - off : 0x8000);
    return rom.slice(off, off + size);
  }
  return lzDecompress(rom, off);
};

const readSpritePalette = (rom: Uint8Array, palPtrs: number[], paletteIndex: number): [number, number, number][] => {
  const off = itemAt(palPtrs, paletteIndex);
  const cols: [number, number, number][] = [[0, 0, 0]];
  for (let i = 0; i < 12; i += 1) cols.push(snes15ToRgb(wordAt(rom, off + i * 2)));
  return [...cols, [0, 0, 0], [0, 0, 0], [0, 0, 0]];
};

export { parseTables, readHeader, readSpriteGraphics, readSpritePalette };
export type { SpriteHeader, SpriteTables };
