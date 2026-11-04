/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';

const until0 = (rom: Uint8Array, start: number): number => {
  let a = start;
  while (byteAt(rom, a) !== 0) a += 1;
  return a + 1;
};

export { until0 };
