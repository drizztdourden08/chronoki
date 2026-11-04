/* @layer shared-asset-extraction @kind logic */
const W = 256;
const H = 224;

/** A colour packed as (R<<16)|(G<<8)|B. */
type Frame = number[][];

/** load_fb: the true 256x224 grid of an oracle fb (512x480, 2x doubled, [pad,B,G,R] per px). */
const loadFb = (d: Uint8Array): Frame => {
  const px: Frame = [];
  for (let y = 0; y < H; y += 1) {
    const row: number[] = [];
    for (let x = 0; x < W; x += 1) {
      const o = (2 * y * 512 + 2 * x) * 4;
      row.push(((d[o + 3] as number) << 16) | ((d[o + 2] as number) << 8) | (d[o + 1] as number));
    }
    px.push(row);
  }
  return px;
};

/** build_palette: the colours in first-seen order, and colour -> index. */
const buildPalette = (frames: Frame[]): { pal: number[]; idxmap: Map<number, number> } => {
  const pal: number[] = [];
  const idxmap = new Map<number, number>();
  for (const fr of frames) {
    for (const row of fr) {
      for (const c of row) {
        if (!idxmap.has(c)) {
          idxmap.set(c, pal.length);
          pal.push(c);
        }
      }
    }
  }
  return { pal, idxmap };
};

const toIdx = (fr: Frame, idxmap: Map<number, number>): number[][] =>
  fr.map((row) => row.map((c) => idxmap.get(c) as number));

/** diff_bbox: [x0, x1, y0, y1] of the differing pixels, or null. */
const diffBbox = (a: number[][], b: number[][]): [number, number, number, number] | null => {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if ((a[y] as number[])[x] !== (b[y] as number[])[x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }
  }
  return x1 < 0 ? null : [x0, x1, y0, y1];
};

export type { Frame };
export { buildPalette, diffBbox, H, loadFb, toIdx, W };
