/* @layer shared-asset-extraction @kind logic */
const FB_W = 512;

/** ctgen.rgb_of_fb: the 256x240 RGB picture (3 bytes a pixel) of an oracle framebuffer dump (512x480 [pad,B,G,R], 2x doubled). */
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

/** ctgen.cgram_of: the 512-byte CGRAM of a peek (the .oam sidecar at 1056). */
const cgramOf = (oam: Uint8Array): Uint8Array => oam.slice(1056, 1056 + 512);

export { cgramOf, rgbOfFb };
