/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';
import { wordAt } from '../bytes/word-at';

const ptr24 = (rom: Uint8Array, at: number): number | null => {
  const bank = byteAt(rom, at + 2);
  if (bank < 0xc0) return null;
  return ((bank - 0xc0) << 16) | wordAt(rom, at);
};

export { ptr24 };
