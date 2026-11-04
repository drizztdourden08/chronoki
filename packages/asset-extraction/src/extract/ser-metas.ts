/* @layer shared-asset-extraction @kind logic */
import type { Corner } from './metatiles.type';
import { createLeWriter } from '../buffer/le-writer';

const serMetas = (metas: Corner[][], count: number): Uint8Array => {
  const b = createLeWriter();
  const blank: Corner = [0, 0, false, false, false];
  for (let t = 0; t < count; t += 1) {
    const m = t < metas.length ? metas[t]! : [blank, blank, blank, blank];
    for (const [chip, base, fx, fy, prio] of m) {
      b.u16(chip & 0xffff);
      b.u8(base & 0xff);
      b.u8((fx ? 1 : 0) | ((fy ? 1 : 0) << 1) | ((prio ? 1 : 0) << 2));
    }
  }
  return b.toBytes();
};

export { serMetas };
