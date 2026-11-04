/* @layer shared-asset-extraction @kind logic */
import { romRegion } from '../rom/rom-region';

const chromeImage = (rom: Uint8Array, queue: boolean[]): Uint8Array => {
  const b = romRegion(rom, 0x115800, 0x115800 + 0x180);
  const fr = romRegion(rom, 0x1159fc, 0x1159fc + 6 * 14);
  for (let s = 0; s < 3; s += 1) {
    if (!queue[s]) continue;
    const skip = s > 0 && queue[s - 1] ? 1 : 0;
    const dst = 12 * s + 2 * skip;
    for (let r = 0; r < 6; r += 1) b.set(fr.subarray(r * 14 + 2 * skip, r * 14 + 14), r * 0x40 + dst);
  }
  return b;
};

export { chromeImage };
