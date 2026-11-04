/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress */
import { at } from './rom-at';
import type { LzState } from './lz-decompress.type';
import { rawBlock, flagBlock, nextSegment } from './lz-ops';

const lzDecompress = (data: Uint8Array, start: number): Uint8Array => {
  const compressedSize = (at(data, start + 1) << 8) | at(data, start);
  const bytePos = start + 2;
  const byteAfter = bytePos + compressedSize;
  const st: LzState = {
    data,
    start,
    bytePos,
    byteAfter,
    workPos: 0,
    bitsCount: 8,
    small: (at(data, byteAfter) & 0xc0) !== 0,
    out: new Uint8Array(1 << 18),
  };
  for (;;) {
    if (st.bytePos === st.byteAfter) {
      if (nextSegment(st)) return st.out.slice(0, st.workPos);
      continue;
    }
    const cur = at(data, st.bytePos);
    if (cur === 0) rawBlock(st);
    else flagBlock(st, cur);
  }
};

export { lzDecompress };
