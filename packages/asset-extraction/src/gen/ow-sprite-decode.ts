/* @layer shared-asset-extraction @kind logic */
import { x5 } from './ctgen/menugfx';

/** tools/gen/ow_sprites.py spr_frames: the pixel blocks of a .spr atlas (count byte, then 7-byte headers + w*h*4 RGBA). */
const sprFrames = (data: Uint8Array): Uint8Array[] => {
  const out: Uint8Array[] = [];
  let o = 1;
  for (let i = 0; i < (data[0] as number); i += 1) {
    const size = (data[o + 3] as number) * (data[o + 4] as number) * 4;
    out.push(data.slice(o + 7, o + 7 + size));
    o += 7 + size;
  }
  if (o !== data.length) throw new Error(`ow_sprites: a malformed .spr (${o} of ${data.length} bytes)`);
  return out;
};

/** ow_sprites.decode16: a 16x16 OBJ (name base `base` bytes, the second table at +0x2000) -> RGBA; `cg` are the 256 CGRAM words. */
const decode16 = (vram: Uint8Array, cg: number[], name: number, pal: number, base = 0): Uint8Array => {
  const px = new Uint8Array(16 * 16 * 4);
  for (let py = 0; py < 16; py += 1) {
    for (let x = 0; x < 16; x += 1) {
      const t = ((name & 0xff) + (x >> 3) + (py >> 3) * 0x10) & 0xff;
      const ba = base + t * 32 + (name & 0x100 ? 0x2000 : 0);
      const row = py & 7;
      const kk = 7 - (x & 7);
      const b0 = vram[ba + row * 2] as number;
      const b1 = vram[ba + row * 2 + 1] as number;
      const b2 = vram[ba + 16 + row * 2] as number;
      const b3 = vram[ba + 16 + row * 2 + 1] as number;
      const v = ((b0 >> kk) & 1) | (((b1 >> kk) & 1) << 1) | (((b2 >> kk) & 1) << 2) | (((b3 >> kk) & 1) << 3);
      if (!v) continue;
      const cw = cg[128 + pal * 16 + v] as number;
      px.set([x5(cw & 31), x5((cw >> 5) & 31), x5((cw >> 10) & 31), 255], (py * 16 + x) * 4);
    }
  }
  return px;
};

export { decode16, sprFrames };
