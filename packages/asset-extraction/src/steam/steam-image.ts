/* @layer shared-asset-extraction @kind logic */
import { inflate } from './steam-archive';

interface Rgba {
  w: number;
  h: number;
  px: Uint8Array;
}

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const CHANNELS: Record<number, number> = { 0: 1, 2: 3, 3: 1, 6: 4 };

const unfilter = (raw: Uint8Array, w: number, h: number, ch: number): Uint8Array[] => {
  const stride = w * ch;
  const rows: Uint8Array[] = [];
  let prev = new Uint8Array(stride);
  let p = 0;
  for (let y = 0; y < h; y += 1) {
    const f = raw[p] as number;
    const line = raw.slice(p + 1, p + 1 + stride);
    p += 1 + stride;
    for (let i = 0; i < stride; i += 1) {
      const a = i >= ch ? (line[i - ch] as number) : 0;
      const b = prev[i] as number;
      const c = i >= ch ? (prev[i - ch] as number) : 0;
      const l = line[i] as number;
      if (f === 1) line[i] = (l + a) & 255;
      else if (f === 2) line[i] = (l + b) & 255;
      else if (f === 3) line[i] = (l + ((a + b) >> 1)) & 255;
      else if (f === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        line[i] = (l + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
    }
    rows.push(line);
    prev = line;
  }
  return rows;
};

/** steam_wide.py _png_rgba: an 8-bit PNG (palette with tRNS, grey, RGB or RGBA; no interlace) as RGBA, or null. */
const pngRgba = async (data: Uint8Array): Promise<Rgba | null> => {
  if (PNG_MAGIC.some((m, i) => data[i] !== m)) return null;
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const idat: Uint8Array[] = [];
  let plte: Uint8Array = new Uint8Array(0);
  let trns: Uint8Array = new Uint8Array(0);
  let w = 0;
  let h = 0;
  let depth = 0;
  let ctype = 0;
  for (let o = 8; o + 8 <= data.length; ) {
    const n = dv.getUint32(o, false);
    const typ = String.fromCharCode(...data.subarray(o + 4, o + 8));
    const body = data.subarray(o + 8, o + 8 + n);
    o += 12 + n;
    if (typ === 'IHDR') {
      const bv = new DataView(body.buffer, body.byteOffset, body.byteLength);
      [w, h, depth, ctype] = [bv.getUint32(0, false), bv.getUint32(4, false), body[8] as number, body[9] as number];
    } else if (typ === 'PLTE') plte = body;
    else if (typ === 'tRNS') trns = body;
    else if (typ === 'IDAT') idat.push(body);
  }
  const ch = CHANNELS[ctype];
  if (depth !== 8 || ch === undefined) return null;
  const joined = new Uint8Array(idat.reduce((s, c) => s + c.length, 0));
  idat.reduce((at, c) => (joined.set(c, at), at + c.length), 0);
  const rows = unfilter(await inflate(joined, 'deflate'), w, h, ch);
  const px = new Uint8Array(w * h * 4);
  rows.forEach((line, y) => {
    for (let x = 0; x < w; x += 1) {
      const d = (y * w + x) * 4;
      if (ctype === 3) {
        const k = line[x] as number;
        px.set(plte.subarray(3 * k, 3 * k + 3), d);
        px[d + 3] = k < trns.length ? (trns[k] as number) : 255;
      } else if (ctype === 0) px.set([line[x] as number, line[x] as number, line[x] as number, 255], d);
      else if (ctype === 2) px.set([...line.subarray(3 * x, 3 * x + 3), 255], d);
      else px.set(line.subarray(4 * x, 4 * x + 4), d);
    }
  });
  return { w, h, px };
};

/** steam_wide.py _halve: back to the SNES's pixels, each 2 x 2 block's most common opaque colour (see-through when most of it is). */
const halve = ({ w, h, px }: Rgba): Rgba => {
  const out: number[] = [];
  for (let y = 0; y < h - 1; y += 2) {
    for (let x = 0; x < w - 1; x += 2) {
      const opaque: string[] = [];
      for (const j of [0, 1]) {
        for (const i of [0, 1]) {
          const o = 4 * ((y + j) * w + x + i);
          if ((px[o + 3] as number) >= 128) opaque.push(Array.from(px.subarray(o, o + 4)).join(','));
        }
      }
      if (opaque.length < 2) out.push(0, 0, 0, 0);
      else {
        let best = opaque[0] as string;
        for (const c of opaque) if (opaque.filter((q) => q === c).length > opaque.filter((q) => q === best).length) best = c;
        out.push(...best.split(',').slice(0, 3).map(Number), 255);
      }
    }
  }
  return { w: Math.floor(w / 2), h: Math.floor(h / 2), px: Uint8Array.from(out) };
};

export { halve, pngRgba };
export type { Rgba };
