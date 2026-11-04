/* @layer shared-asset-extraction @kind logic */
import { byteAt, itemAt, wordAt } from './byte-reader';
import { getEntries2Byte, getEntries3Byte } from '../rom-read';
import { lzDecompress } from '../lz-decompress';
import { snes15ToRgb } from '../snes-color';

const HEADER_BASE = 0x24f000;
const PTR_TABLE = 0x24ffe0;
const ENEMY_RECORDS = 0x24f600;

interface SpriteHeader {
  bitmap: number;
  assembly: number;
  palette: number;
  anim: number;
  size: number;
}

interface SpriteTables {
  gfxPtrs: number[];
  palPtrs: number[];
  asmPtrs: number[];
}

const tablesCache = new WeakMap<Uint8Array, SpriteTables>();

/** sprites.parse_tables (the three lists the packers use). */
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

/** sprites.read_header: an NPC/PC record (5 bytes) or, from 0x100, an enemy record (10 bytes) at $E4:F600. */
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

/** sprites.read_sprite_graphics: the 7 PCs' are raw, the rest LZ. */
const readSpriteGraphics = (rom: Uint8Array, gfxPtrs: number[], bitmapIndex: number): Uint8Array => {
  const off = itemAt(gfxPtrs, bitmapIndex);
  if (bitmapIndex <= 6) {
    const hi = gfxPtrs.filter((p) => p > off);
    const size = Math.min(0x8000, hi.length > 0 ? Math.min(...hi) - off : 0x8000);
    return rom.slice(off, off + size);
  }
  return lzDecompress(rom, off);
};

/** sprites.read_sprite_palette: colour 0 transparent, 12 ROM colours at 1..12, 13..15 black. */
const readSpritePalette = (rom: Uint8Array, palPtrs: number[], paletteIndex: number): [number, number, number][] => {
  const off = itemAt(palPtrs, paletteIndex);
  const cols: [number, number, number][] = [[0, 0, 0]];
  for (let i = 0; i < 12; i += 1) cols.push(snes15ToRgb(wordAt(rom, off + i * 2)));
  return [...cols, [0, 0, 0], [0, 0, 0], [0, 0, 0]];
};

export { parseTables, readHeader, readSpriteGraphics, readSpritePalette };
export type { SpriteHeader, SpriteTables };
