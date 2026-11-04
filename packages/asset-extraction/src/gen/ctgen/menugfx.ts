/* @layer shared-asset-extraction @kind logic */
type Rgb = [number, number, number];

/** tools/gen/menugfx.py tile4: the 64 colour indices (row-major 8x8) of the 4bpp tile n at VRAM byte base + n*32. */
const tile4 = (vram: Uint8Array, base: number, n: number): number[] => {
  const o = base + n * 32;
  const out: number[] = [];
  for (let y = 0; y < 8; y += 1) {
    const p0 = vram[o + y * 2] as number;
    const p1 = vram[o + y * 2 + 1] as number;
    const p2 = vram[o + 16 + y * 2] as number;
    const p3 = vram[o + 16 + y * 2 + 1] as number;
    for (let x = 0; x < 8; x += 1) {
      const b = 7 - x;
      out.push(((p0 >> b) & 1) | (((p1 >> b) & 1) << 1) | (((p2 >> b) & 1) << 2) | (((p3 >> b) & 1) << 3));
    }
  }
  return out;
};

/** A 5-bit channel as the PPU expands it to 8 bits. */
const x5 = (v: number): number => (v << 3) | (v >> 2);

/** CGRAM entry i as its BGR555 word. */
const cgWord = (cg: Uint8Array, i: number): number => (cg[i * 2] as number) | ((cg[i * 2 + 1] as number) << 8);

/** CGRAM colour i as 8-bit RGB. */
const rgb = (cg: Uint8Array, i: number): Rgb => {
  const w = cgWord(cg, i);
  return [x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)];
};

/** rgb + 255, or (0,0,0,0) for i % 16 == 0. */
const rgba = (cg: Uint8Array, i: number): [number, number, number, number] =>
  i % 16 === 0 ? [0, 0, 0, 0] : [...rgb(cg, i), 255];

/** A 16x16 block of four 8x8 4bpp tiles -> 256 indices, row-major. */
const block16 = (vram: Uint8Array, base: number, tl: number, tr: number, bl: number, br: number): number[] => {
  const t = [tl, tr, bl, br].map((n) => tile4(vram, base, n));
  const out: number[] = [];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      out.push((t[(y >> 3) * 2 + (x >> 3)] as number[])[(y % 8) * 8 + (x % 8)] as number);
    }
  }
  return out;
};

export { block16, cgWord, rgb, rgba, tile4, x5 };
export type { Rgb };
