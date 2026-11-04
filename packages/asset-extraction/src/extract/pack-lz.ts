/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from '../ctas/ctas.type';
import { T_LZ } from './asset-types.constants';
import { concatBytes } from './bytes/concat-bytes';
import type { Packer } from './extract.type';

const readU32 = (d: Uint8Array, o: number): number => {
  if (o + 4 > d.length) throw new RangeError(`saves/lz_pack.bin: short read at ${o}`);
  return ((d[o] as number) | ((d[o + 1] as number) << 8) | ((d[o + 2] as number) << 16) | ((d[o + 3] as number) << 24)) >>> 0;
};

const packLz: Packer = async ({ work }) => {
  const d = await work.readBytes('saves/lz_pack.bin');
  if (d === null) return [];
  if (String.fromCharCode(d[0] ?? 0, d[1] ?? 0, d[2] ?? 0, d[3] ?? 0) !== 'CTLZ') throw new Error('saves/lz_pack.bin: not an LZ pack');
  const n = readU32(d, 4);
  const entries: CtasEntry[] = [];
  let o = 8;
  for (let i = 0; i < n; i += 1) {
    const off = readU32(d, o);
    const ln = readU32(d, o + 4);
    readU32(d, o + 12);
    const costs = d.subarray(o + 8, o + 16);
    o += 16;
    const head = new Uint8Array(4);
    new DataView(head.buffer).setUint32(0, ln, true);
    entries.push({ type: T_LZ, id: off, blob: concatBytes([head, costs, d.subarray(o, o + ln)]) });
    o += ln;
  }
  return entries;
};

export { packLz };
