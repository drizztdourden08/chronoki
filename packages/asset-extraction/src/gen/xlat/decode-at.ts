/* @layer shared-asset-extraction @kind logic */
import { TABLE } from './disasm.constants';
import { memByte } from './mem-byte';
import { opLen } from './op-len';
import type { XlatInput } from './xlat-site.type';
import type { Decoded, Work } from './xlat-static.type';

const decodeAt = (input: XlatInput, w: Work): Decoded | null => {
  const b0 = memByte(input, w.image, w.adr);
  if (b0 === undefined) return null;
  const len = 1 + opLen((TABLE[b0] as readonly [string, string])[1], w.m, w.x);
  const bytes: number[] = [];
  for (let j = 0; j < len; j += 1) {
    const v = memByte(input, w.image, w.adr + j);
    if (v === undefined) return null;
    bytes.push(v);
  }
  return { op: b0, bytes, len };
};

export { decodeAt };
