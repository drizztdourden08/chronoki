/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress */
import { at } from './rom-at';

const lzDecompress = (data: Uint8Array, start: number): Uint8Array => {
  const compressedSize = (at(data, start + 1) << 8) | at(data, start);
  let bytePos = start + 2;
  let byteAfter = bytePos + compressedSize;
  let workPos = 0;
  let bitsCount = 8;
  const small = (at(data, byteAfter) & 0xc0) !== 0;
  let out = new Uint8Array(1 << 18);

  const ensure = (n: number): void => {
    if (n >= out.length) {
      const grown = new Uint8Array(n + (1 << 16));
      grown.set(out);
      out = grown;
    }
  };
  const copyBytes = (): void => {
    let count = at(data, bytePos + 1);
    count >>= small ? 3 : 4;
    count += 2;
    let off = (at(data, bytePos + 1) << 8) | at(data, bytePos);
    off &= small ? 0x07ff : 0x0fff;
    for (let i = 0; i < count + 1; i += 1) {
      const from = workPos - off + i;
      out[workPos + i] = from < 0 ? out[out.length + from]! : out[from]!;
    }
    workPos += count + 1;
    bytePos += 2;
  };
  const literal = (): void => {
    out[workPos] = at(data, bytePos);
    workPos += 1;
    bytePos += 1;
  };

  for (;;) {
    if (bytePos === byteAfter) {
      const cur = at(data, bytePos) & 0x3f;
      if (cur === 0) return out.slice(0, workPos);
      bitsCount = cur;
      byteAfter = start + ((at(data, bytePos + 2) << 8) | at(data, bytePos + 1));
      bytePos += 3;
    } else {
      let cur = at(data, bytePos);
      if (cur === 0) {
        ensure(workPos + 8);
        for (let i = 1; i < 9; i += 1) {
          out[workPos] = at(data, bytePos + i);
          workPos += 1;
        }
        bytePos += 9;
      } else {
        bytePos += 1;
        const carry = cur & 1;
        cur >>= 1;
        let mem = cur;
        ensure(workPos + 4096);
        if (carry) copyBytes();
        else literal();
        for (;;) {
          bitsCount -= 1;
          if (bitsCount === 0) {
            bitsCount = 8;
            break;
          }
          const c = mem & 1;
          mem >>= 1;
          ensure(workPos + 4096);
          if (c) copyBytes();
          else literal();
        }
      }
    }
  }
};

export { lzDecompress };
