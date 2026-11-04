/* @layer shared-asset-extraction @kind logic */
import { cgramOf } from './shared/fb-decode';
import type { Rgb3 } from './battle-hud-strip';
import { STRIP_H } from './battle-hud-strip';

type MapCell = [tile: number, pal: number];

const tmword = (vram: Uint8Array, i: number): number => {
  const o = 0x7800 * 2 + i * 2;
  return (vram[o] as number) | ((vram[o + 1] as number) << 8);
};

/** Map rows 0..6 (the window's 7 tile rows), full 32 cols, as (tile,pal) pairs. */
const bakeMap = (vram: Uint8Array): MapCell[][] => {
  const rows: MapCell[][] = [];
  for (let r = 0; r < 7; r += 1) {
    const row: MapCell[] = [];
    for (let c = 0; c < 32; c += 1) {
      const wd = tmword(vram, r * 32 + c);
      row.push([wd & 0x3ff, (wd >> 10) & 7]);
    }
    rows.push(row);
  }
  return rows;
};

const x5 = (v: number): number => (v << 3) | (v >> 2);

/** CGRAM -> pal[8][4] RGB for 2bpp BG (palette P = CGRAM[P*4 .. P*4+3]). */
const cgramPalettes = (oam: Uint8Array): Rgb3[][] => {
  const cg = cgramOf(oam);
  const pal: Rgb3[][] = [];
  for (let p = 0; p < 8; p += 1) {
    const row: Rgb3[] = [];
    for (let c = 0; c < 4; c += 1) {
      const idx = p * 4 + c;
      const w = (cg[idx * 2] as number) | ((cg[idx * 2 + 1] as number) << 8);
      row.push([x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)]);
    }
    pal.push(row);
  }
  return pal;
};

/** Shared colour palette of the chrome textures, sorted by (sum, colour); 0xFF is reserved as a sentinel. */
const bg1Palette = (...texes: Rgb3[][][]): Rgb3[] => {
  const cols = new Map<string, Rgb3>();
  for (const tex of texes) {
    for (let ry = 0; ry < STRIP_H; ry += 1) {
      for (const c of tex[ry] as Rgb3[]) cols.set(c.join(','), c);
    }
  }
  const sum = (c: Rgb3): number => c[0] + c[1] + c[2];
  const pal = [...cols.values()].sort((a, b) => sum(a) - sum(b) || a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  if (pal.length > 255) throw new Error(`chrome palette too large for a uint8 index (${pal.length})`);
  return pal;
};

const bg1Index = (tex: Rgb3[][], pal: Rgb3[]): number[][] => {
  const idx = new Map(pal.map((c, i) => [c.join(','), i]));
  return tex.map((row) => row.map((c) => idx.get(c.join(',')) as number));
};

export type { MapCell };
export { bakeMap, bg1Index, bg1Palette, cgramPalettes };
