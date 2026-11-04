/* @layer shared-asset-extraction @kind logic */
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

export { tile4 };
