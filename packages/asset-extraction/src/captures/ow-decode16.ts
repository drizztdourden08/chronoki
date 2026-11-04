/* @layer shared-asset-extraction @kind logic */

const c5 = (x: number): number => (x << 3) | (x >> 2);

const cgramWords = (cg: Uint8Array): number[] =>
  Array.from({ length: 256 }, (_, i) => (cg[i * 2] as number) | ((cg[i * 2 + 1] as number) << 8));

const decode16 = (vram: Uint8Array, cg: number[], name: number, pal: number, base = 0): Uint8Array => {
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

const sprFrames = (data: Uint8Array): { head: Uint8Array; px: Uint8Array }[] => {
  const out: { head: Uint8Array; px: Uint8Array }[] = [];
  let o = 1;
  for (let i = 0; i < (data[0] as number); i += 1) {
    const n = (data[o + 3] as number) * (data[o + 4] as number) * 4;
    out.push({ head: data.slice(o, o + 7), px: data.slice(o + 7, o + 7 + n) });
    o += 7 + n;
  }
  if (o !== data.length) throw new Error(`ow_sprites: a malformed .spr (${o} of ${data.length} bytes)`);
  return out;
};

export { cgramWords, decode16, sprFrames };
