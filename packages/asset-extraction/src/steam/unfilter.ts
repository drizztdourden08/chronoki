/* @layer shared-asset-extraction @kind logic */
import { unfilterByte } from './unfilter-byte';

const unfilter = (raw: Uint8Array, w: number, h: number, ch: number): Uint8Array[] => {
  const stride = w * ch;
  const rows: Uint8Array[] = [];
  let prev = new Uint8Array(stride);
  let p = 0;
  for (let y = 0; y < h; y += 1) {
    const f = raw[p] as number;
    const line = raw.slice(p + 1, p + 1 + stride);
    p += 1 + stride;
    for (let i = 0; i < stride; i += 1) {
      const a = i >= ch ? (line[i - ch] as number) : 0;
      const b = prev[i] as number;
      const c = i >= ch ? (prev[i - ch] as number) : 0;
      line[i] = unfilterByte(f, line[i] as number, { a, b, c });
    }
    rows.push(line);
    prev = line;
  }
  return rows;
};

export { unfilter };
