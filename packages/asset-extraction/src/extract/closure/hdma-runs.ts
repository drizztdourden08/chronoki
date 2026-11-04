/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';

const hdmaRuns = (rom: Uint8Array, start: number, width: number): number => {
  let a = start;
  while (byteAt(rom, a) !== 0) a += 1 + width;
  return a + 1;
};

export { hdmaRuns };
