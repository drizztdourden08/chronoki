/* @layer shared-asset-extraction @kind logic */
import type { SpriteHeader } from './sprite-records.type';
import { ENEMY_RECORDS, HEADER_BASE } from './sprite-records.constants';
import { byteAt } from './bytes/byte-reader';

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

export { readHeader };
