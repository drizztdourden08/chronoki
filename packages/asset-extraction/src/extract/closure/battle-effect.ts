/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../lib/byte-reader';
import { byteSpans, romLabel } from './byte-spans';
import { wordTable } from './menu-lib';
import type { RomTable } from './closure.type';

const CD = 0x0d0000;
const CE = 0x0e0000;
const CF = 0x0f0000;
const D0 = 0x100000;
const D1 = 0x110000;

const popcount = (v: number): number => v.toString(2).replace(/0/g, '').length;

/** rom_closure_battle.fx_layout_extent: CD/10AB's layout at D1 + lp: [stride][0x20 mask bytes][the tiles]. */
const fxLayoutExtent = (rom: Uint8Array, lp: number): number => {
  const stride = byteAt(rom, D1 + lp);
  let bits = 0;
  for (let k = 0; k < 0x20; k += 1) bits += popcount(byteAt(rom, D1 + ((lp + 1 + k) & 0xffff)));
  const n = stride & 0x80 ? 0x20 : bits * stride + 1;
  return 1 + 0x20 + Math.max(n, 1);
};

/** The BG3 sheets (CD/11E8) and the OBJ sheets (CD/1368), and the pool tiles they name. */
const sheetTables = (rom: Uint8Array): RomTable[] => {
  const seen = new Set<number>();
  const two = (a: number): void => void (seen.add(a), seen.add(a + 1));
  const run = (a: number, n: number): void => {
    for (let k = a; k < a + n; k += 1) seen.add(k);
  };
  for (let x = 0; x < 256; x += 1) {
    for (let n = 0; n < 0x40; n += 1) {
      const wa = CF + ((((x << 6) + 0x8000) + 2 * n) & 0xffff);
      two(wa);
      run(CF + (((wordAt(rom, wa) & 0x1fff) << 3) & 0xffff), 16);
    }
  }
  for (let x = 0; x < 256; x += 1) {
    two(CF + 0xe000 + 2 * x);
    for (let k = 0; k < 32; k += 1) {
      const wa = CF + ((0xa000 + 64 * x + 2 * k) & 0xffff);
      two(wa);
      run(D0 + (((wordAt(rom, wa) & 0x1fff) << 3) & 0xffff), 24);
    }
  }
  return byteSpans(seen).map(([a, b]): RomTable => [`effect sheets ${romLabel(a)}`, a, b]);
};

/** The HDMA presets (CE/EE6E: CE:F24E[idx * 2] -> nine words at CE:F58E.. -> 0x1E bytes each). */
const hdmaPresets = (rom: Uint8Array): RomTable[] => {
  const seen = new Set<number>();
  for (let i = 0; i < 256; i += 1) {
    const x2 = wordAt(rom, CE + 0xf24e + 2 * i);
    for (const k of [0, 2, 4, 6, 8, 10, 12, 14, 16, 0x12]) {
      const a = CE + ((0xf58e + k + x2) & 0xffff);
      seen.add(a);
      seen.add(a + 1);
      const f = CE | wordAt(rom, a);
      for (let j = f; j < f + 0x1e; j += 1) seen.add(j);
    }
  }
  return byteSpans(seen).map(([a, b]): RomTable => [`HDMA preset tables ${romLabel(a)}`, a, b]);
};

/** rom_closure_battle.effect_tables: the battle effects (CD/0F4F .. CD/3BFD, D1's programs and layouts, CE's tables, CF / D0's sheets). */
const effectTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [];
  const t = (name: string, a: number, n: number): void => void out.push([name, a, a + n]);
  t('effect programs and palettes ($D1:6240, 4 x 256)', D1 + 0x6240, 4 * 256);
  t('effect block rows ($D1:A233, 6 x 256)', D1 + 0xa233, 6 * 256);
  t('effect palette records ($D1:6002, 8 x 256)', D1 + 0x6002, 8 * 256);
  const [ps] = wordTable(rom, D1 + 0x646c, D1);
  t('effect program pointers ($D1:646C)', D1 + 0x646c, 2 * 256);
  out.push(['effect programs ($D1:xxxx-A233)', D1 + Math.min(...ps), D1 + 0xa233]);
  const [ls, end] = wordTable(rom, D1 + 0xa575, D1);
  t('effect layout pointers ($D1:A575)', D1 + 0xa575, end - (D1 + 0xa575));
  for (const lp of [...new Set(ls)].sort((a, b) => a - b)) out.push([`effect layout D1/${lp.toString(16)}`, D1 + lp, D1 + lp + fxLayoutExtent(rom, lp)]);
  out.push(...sheetTables(rom));
  t('BG3 tile attributes ($CF:E200, 8-bit)', CF + 0xe200, 256);
  t('OBJ sheet masks and VRAM ($CD:1300, $CD:1308)', CD + 0x1300, 8 + 12);
  t('HDMA preset bases ($CE:F24E, 8-bit)', CE + 0xf24e, 2 * 256);
  out.push(...hdmaPresets(rom));
  t('fade records, modes ($CE:EFE0-F00E)', CE + 0xefe0, 0xf00e - 0xefe0);
  t('block bits and columns ($CE:F03E, 8; $CE:F046, 8-bit)', CE + 0xf03e, 8 + 256);
  t('fade records A/B ($CE:F0E6/F0EE, ($53 & F0) + 8)', CE + 0xf0e6, 0xf8 + 8);
  t('fade ticks and steps ($CE:F126, $CE:F146)', CE + 0xf126, 0x20 + 0x10);
  t('effect load sizes ($CE:F156, 8 words)', CE + 0xf156, 16);
  t('wobble steps ($CE:F1D2, 8-bit)', CE + 0xf1d2, 256);
  t('rim vectors ($CE:F28E, 2 x 256)', CE + 0xf28e, 512);
  t('magnitudes ($CE:F48E, 8-bit)', CE + 0xf48e, 256);
  t('status ramps ($CE:0100)', CE + 0x0100, 0x100);
  t('tilemap quadrant VRAM ($CD:05FF, $CA16 * 2)', CD + 0x05ff, 2 * 256);
  t('object slot records ($CD:2A42, k)', CD + 0x2a42, 256);
  t('object offsets ($CD:26B0, ix)', CD + 0x26b0, 2 * 256);
  t('window line bases ($CD:38AA, 4 words)', CD + 0x38aa, 8);
  t('dissolve wait ($CD:00C0)', CD + 0x00c0, 1);
  t('one-cell records ($D1:50A2, 6 x 16)', D1 + 0x50a2, 6 * 16);
  t('bracket pulse ($D1:5980, 62 words)', D1 + 0x5980, 2 * 0x3e);
  t('status icon sheet ($D1:3900, tiles 1A0-1FF)', D1 + 0x3900, 32 * 0x60);
  t('battle shadow and UI tiles ($D1:5A50-5FFF)', D1 + 0x5a50, 0x5fff - 0x5a50);
  t('PC down poses ($D1:5F42, 4 x 8)', D1 + 0x5f42, 32);
  t('target strip records ($D1:5E10, $D1:5E49)', D1 + 0x5e10, 0x39 + 0x40 + 0x39);
  t('spin models ($D1:EC5F, 8-bit)', D1 + 0xec5f, 256 + 3);
  t('shake tables ($D1:F69C-F6B3)', D1 + 0xf69c, 0x18);
  t('OBJ rows ($D1:E70A)', D1 + 0xe70a, 0x100);
  return out;
};

export { effectTables };
