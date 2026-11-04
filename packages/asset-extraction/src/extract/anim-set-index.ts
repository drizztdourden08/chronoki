/* @layer shared-asset-extraction @kind logic */
import { byteAt } from './bytes/byte-reader';

const animSetIndex = (rom: Uint8Array, spriteIndex: number): number =>
  spriteIndex < 0x100 ? byteAt(rom, 0x24f000 + spriteIndex * 5 + 3) : byteAt(rom, 0x24f600 + (spriteIndex - 256) * 10 + 3);

export { animSetIndex };
