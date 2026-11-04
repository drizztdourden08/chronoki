/* @layer shared-asset-extraction @kind logic */
const FB_W = 512;

const rgbOfFb = (d: Uint8Array): Uint8Array => {
  const out = new Uint8Array(256 * 240 * 3);
  for (let y = 0; y < 240; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      const o = (2 * y * FB_W + 2 * x) * 4;
      const i = (y * 256 + x) * 3;
      out[i] = d[o + 3] as number;
      out[i + 1] = d[o + 2] as number;
      out[i + 2] = d[o + 1] as number;
    }
  }
  return out;
};

const cgramOf = (oam: Uint8Array): Uint8Array => oam.slice(1056, 1056 + 512);

export { cgramOf, rgbOfFb };
