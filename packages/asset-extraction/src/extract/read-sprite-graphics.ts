/* @layer shared-asset-extraction @kind logic */
import { itemAt } from './bytes/item-at';
import { lzDecompress } from './lz-decompress';

const readSpriteGraphics = (rom: Uint8Array, gfxPtrs: number[], bitmapIndex: number): Uint8Array => {
  const off = itemAt(gfxPtrs, bitmapIndex);
  if (bitmapIndex <= 6) {
    const hi = gfxPtrs.filter((p) => p > off);
    const size = Math.min(0x8000, hi.length > 0 ? Math.min(...hi) - off : 0x8000);
    return rom.slice(off, off + size);
  }
  return lzDecompress(rom, off);
};

export { readSpriteGraphics };
