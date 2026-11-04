/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';

/** One meta corner: chip, palette base, flip x, flip y, priority. */
type Corner = [chip: number, base: number, fx: boolean, fy: boolean, prio: boolean];

/** maps._metatiles with sub256 false: `count` metatiles of 4 corners from the assembly bytes. */
const parseMetatiles = (asm: Uint8Array, count: number, palMul: number): Corner[][] => {
  const out: Corner[][] = [];
  let p = 0;
  for (let t = 0; t < count; t += 1) {
    const corners: Corner[] = [];
    for (let c = 0; c < 4; c += 1) {
      if (p + 1 >= asm.length) {
        corners.push([0, 0, false, false, false]);
        continue;
      }
      const v = asm[p]! | (asm[p + 1]! << 8);
      p += 2;
      corners.push([v & 0x3ff, ((v >> 10) & 7) * palMul, (v & 0x4000) !== 0, (v & 0x8000) !== 0, (v & 0x2000) !== 0]);
    }
    out.push(corners);
  }
  return out;
};

/** extract_assets._ser_metas: {chip u16, base u8, flags u8 (fx | fy << 1 | prio << 2)} per corner, `count` metas. */
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

export { parseMetatiles, serMetas };
export type { Corner };
