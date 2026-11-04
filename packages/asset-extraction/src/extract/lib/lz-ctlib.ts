/* @layer shared-asset-extraction @kind logic */
import { byteAt } from './byte-reader';

/** ctlib/lz.py decompress: the second LZ twin (bit loop; a back-reference before the start is an error). Used by the closures. */
const lzCtlibDecompress = (data: Uint8Array, start: number): Uint8Array => {
  const size = byteAt(data, start) | (byteAt(data, start + 1) << 8);
  let bp = start + 2;
  let after = bp + size;
  const small = (byteAt(data, after) & 0xc0) !== 0;
  const out: number[] = [];
  let bits = 8;
  const copy = (): void => {
    const b0 = byteAt(data, bp);
    const b1 = byteAt(data, bp + 1);
    const count = (small ? b1 >> 3 : b1 >> 4) + 2;
    const off = ((b1 << 8) | b0) & (small ? 0x07ff : 0x0fff);
    if (off > out.length) throw new Error('back-reference before the start');
    for (let i = 0; i <= count; i += 1) {
      const v = out[out.length - off];
      if (v === undefined) throw new Error('back-reference past the end');
      out.push(v);
    }
    bp += 2;
  };
  for (;;) {
    if (bp === after) {
      const cur = byteAt(data, bp) & 0x3f;
      if (cur === 0) return Uint8Array.from(out);
      bits = cur;
      after = start + (byteAt(data, bp + 1) | (byteAt(data, bp + 2) << 8));
      bp += 3;
      continue;
    }
    let mem = byteAt(data, bp);
    if (mem === 0) {
      for (const v of data.subarray(bp + 1, bp + 9)) out.push(v);
      bp += 9;
      continue;
    }
    bp += 1;
    for (let i = 0; i < bits; i += 1) {
      if (mem & 1) copy();
      else {
        out.push(byteAt(data, bp));
        bp += 1;
      }
      mem >>= 1;
    }
    bits = 8;
  }
};

export { lzCtlibDecompress };
