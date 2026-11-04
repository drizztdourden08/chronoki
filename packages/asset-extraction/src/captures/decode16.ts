/* @layer shared-asset-extraction @kind logic */
import { c5 } from './c5';

const decode16 = (vram: Uint8Array, cg: number[], ...tile: [name: number, pal: number, base?: number]): Uint8Array => {
  const [name, pal, base = 0] = tile;
  const px = new Uint8Array(16 * 16 * 4);
  const v8 = (i: number): number => vram[i] as number;
  for (let py = 0; py < 16; py += 1) {
    for (let x = 0; x < 16; x += 1) {
      const t = ((name & 0xff) + (x >> 3) + (py >> 3) * 0x10) & 0xff;
      const ba = base + t * 32 + (name & 0x100 ? 0x2000 : 0);
      const row = py & 7;
      const kk = 7 - (x & 7);
      const v =
        ((v8(ba + row * 2) >> kk) & 1) |
        (((v8(ba + row * 2 + 1) >> kk) & 1) << 1) |
        (((v8(ba + 16 + row * 2) >> kk) & 1) << 2) |
        (((v8(ba + 16 + row * 2 + 1) >> kk) & 1) << 3);
      if (!v) continue;
      const cw = cg[128 + pal * 16 + v] as number;
      px.set([c5(cw & 31), c5((cw >> 5) & 31), c5((cw >> 10) & 31), 255], (py * 16 + x) * 4);
    }
  }
  return px;
};

export { decode16 };
