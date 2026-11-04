/* @layer shared-asset-extraction @kind logic */
import { x5 } from './ctgen/menugfx';
import { hx } from './ctgen/text-file';

const ICON_BASE = 0x3fe55c;
const ICON_PAL = 0x3fcc84;
const NUMT = [
  [0x001, 0x002, 0x011, 0x012],
  [0x003, 0x004, 0x013, 0x014],
  [0x005, 0x006, 0x015, 0x016],
];

type Rgb = [number, number, number];

const rgbOf = (w: number): Rgb => [x5(w & 31), x5((w >> 5) & 31), x5((w >> 10) & 31)];

/** 2bpp (BG3): 4 colours per palette row of this screen's CGRAM. */
const rgb2 = (cg: Uint8Array, prow: number, idx: number): Rgb => {
  const o = (prow * 4 + idx) * 2;
  return rgbOf((cg[o] as number) | ((cg[o + 1] as number) << 8));
};

const cell = (v: number, colour: Rgb): string => (v === 0 ? '0x01000000u' : `0x${colour.map((c) => hx(c, 2)).join('')}u`);

const pixelRows = (px: number[][], colourOf: (v: number) => Rgb): string =>
  px.map((row) => `    {${row.map((v) => cell(v, colourOf(v))).join(',')}},\n`).join('');

/** The four 4bpp tiles of party face `cid`, stored raw in the ROM in reading order (tl, tr, bl, br). */
const iconPixels = (rom: Uint8Array, cid: number): number[][] => {
  const px = Array.from({ length: 16 }, () => new Array<number>(16).fill(0));
  for (let t = 0; t < 4; t += 1) {
    const b = ICON_BASE + cid * 0x80 + t * 32;
    const ox = (t % 2) * 8;
    const oy = (t >> 1) * 8;
    for (let r = 0; r < 8; r += 1) {
      const p0 = rom[b + r * 2] as number;
      const p1 = rom[b + r * 2 + 1] as number;
      const p2 = rom[b + 16 + r * 2] as number;
      const p3 = rom[b + 16 + r * 2 + 1] as number;
      for (let x = 0; x < 8; x += 1) {
        const bit = 7 - x;
        (px[oy + r] as number[])[ox + x] =
          ((p0 >> bit) & 1) | (((p1 >> bit) & 1) << 1) | (((p2 >> bit) & 1) << 2) | (((p3 >> bit) & 1) << 3);
      }
    }
  }
  return px;
};

const ICON_DOC =
  '// The seven party FACE ICONS the summary window draws (BG1 tiles 0x1E0.. at cols 15-16).\n' +
  '// Four 4bpp tiles each, stored RAW in the ROM at $FF:E55C + charId * 0x80 in reading order\n' +
  '// (tl, tr, bl, br), with a SIXTEEN-COLOUR PALETTE OF ITS OWN at $FF:CC84 + charId * 0x20 --\n' +
  '// the three party rows\' tilemap cells carry CGRAM rows 4/5/6, one per character. Both were\n' +
  '// located by searching the ROM for this screen\'s own VRAM tiles and CGRAM rows; index 7 of\n' +
  '// the tile table is garbage, so it holds exactly the seven playable characters.\n' +
  '// Index 0 is transparent and is emitted as the sentinel below.\n' +
  '#define CT_LOADER_ICON_TRANSPARENT 0x01000000u\n' +
  'static const uint32_t ctLoaderIcon[7][16][16] = {\n';

/** ctLoaderIcon: each face in its own ROM palette. */
const iconBlock = (rom: Uint8Array): string => {
  let s = ICON_DOC;
  for (let cid = 0; cid < 7; cid += 1) {
    s += `  { /* charId ${cid} */\n`;
    const ipal = Array.from({ length: 16 }, (_, i) => {
      const o = ICON_PAL + cid * 0x20 + i * 2;
      return rgbOf((rom[o] as number) | ((rom[o + 1] as number) << 8));
    });
    s += pixelRows(iconPixels(rom, cid), (v) => ipal[v] as Rgb);
    s += '  },\n';
  }
  return `${s}};\n\n`;
};

const TONE_DOC =
  '// The tone the BG3 VWF strings are drawn in: this screen\'s CGRAM row 4, 2bpp.\n' +
  'static const uint8_t ctLoaderVwfTone[4][3] = {\n';

const toneBlock = (cg: Uint8Array): string =>
  `${TONE_DOC}${[0, 1, 2, 3].map((i) => `  {${rgb2(cg, 4, i).join(',')}},\n`).join('')}};\n\n`;

const NUMERAL_DOC =
  '// The three BIG SLOT NUMERALS (BG3 tiles 001/002+011/012, 003/004+013/014,\n' +
  '// 005/006+015/016 at cols 3-4 of each slot row).  The ROM BUILDS these -- they are not in\n' +
  '// the ROM raw -- so they are baked from this screen\'s own BG3 CHR (word 0x7000, 2bpp),\n' +
  '// resolved through CGRAM row 4, the palette their tilemap cells carry.\n' +
  'static const uint32_t ctLoaderNumeral[3][16][16] = {\n';

/** ctLoaderNumeral: baked from the screen's own BG3 CHR. */
const numeralBlock = (vram: Uint8Array, cg: Uint8Array): string => {
  let s = NUMERAL_DOC;
  NUMT.forEach((tl, k) => {
    s += `  { /* slot ${k + 1} */\n`;
    const px = Array.from({ length: 16 }, () => new Array<number>(16).fill(0));
    tl.forEach((tn, t) => {
      const ox = (t % 2) * 8;
      const oy = (t >> 1) * 8;
      const base = (0x7000 + tn * 8) * 2;
      for (let r = 0; r < 8; r += 1) {
        const p0 = vram[base + r * 2] as number;
        const p1 = vram[base + r * 2 + 1] as number;
        for (let x = 0; x < 8; x += 1) (px[oy + r] as number[])[ox + x] = ((p0 >> (7 - x)) & 1) | (((p1 >> (7 - x)) & 1) << 1);
      }
    });
    s += pixelRows(px, (v) => rgb2(cg, 4, v));
    s += '  },\n';
  });
  return `${s}};\n\n`;
};

export { iconBlock, numeralBlock, toneBlock };
