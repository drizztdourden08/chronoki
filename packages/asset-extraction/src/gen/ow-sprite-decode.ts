/* @layer shared-asset-extraction @kind logic */
import { x5 } from './ctgen/menugfx';

const decode16 = (vram: Uint8Array, cg: number[], sel: { name: number; pal: number; base?: number }): Uint8Array => {
  const { name, pal, base = 0 } = sel;
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

export { decode16 };
