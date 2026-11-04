/* @layer shared-asset-extraction @kind logic */

const cropRgb = (fb: Uint8Array, head: number[], x0: number, y0: number, w: number, h: number): Uint8Array => {
  const out = new Uint8Array(head.length * 2 + w * h * 3);
  head.forEach((v, i) => {
    out[i * 2] = v & 0xff;
    out[i * 2 + 1] = v >> 8;
  });
  let p = head.length * 2;
  for (let j = 0; j < h; j += 1) {
    for (let i = 0; i < w; i += 1) {
      const o = (2 * (y0 + j) * 512 + 2 * (x0 + i)) * 4;
      out.set([fb[o + 3] as number, fb[o + 2] as number, fb[o + 1] as number], p);
      p += 3;
    }
  }
  return out;
};

export { cropRgb };
