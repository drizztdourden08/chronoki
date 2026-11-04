/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../bytes/byte-reader';
import { hdmaRuns, menuString, until0, windowProgram, wordTable } from './menu-lib';
import type { RomTable } from './closure.type';

const FF = 0x3f0000;
const C2 = 0x020000;
const CC = 0x0c0000;
const DE = 0x1e0000;

const hex4 = (v: number): string => v.toString(16).toUpperCase().padStart(4, '0');
const bytesAt = (rom: Uint8Array, at: number, n: number): number[] => Array.from({ length: n }, (_, i) => byteAt(rom, at + i));

/** The menu strings (every string by C2/EF7E's codes), stat caps, item classes and the VWF strings, font and columns. */
const stringTables = (rom: Uint8Array, out: RomTable[]): void => {
  const t = (name: string, a: number, b: number): void => void out.push([name, a, b]);
  const [ss, end] = wordTable(rom, FF + 0xc457, FF);
  t('menu string pointers ($FF:C457)', FF + 0xc457, end);
  const seen = new Set<number>();
  const caps: number[] = [];
  for (const p of ss) {
    if (!seen.has(FF + p)) {
      seen.add(FF + p);
      caps.push(...menuString(rom, FF + p, seen, out));
    }
  }
  t('stat caps ($FF:CF33)', FF + 0xcf33, FF + 0xcf33 + Math.max(...caps, 7) + 1);
  t('item classes: record bases, strides ($FF:CF0E, CF18)', FF + 0xcf0e, FF + 0xcf18 + 5);
  t('Tab stat offsets and caps ($FF:CF2B, CF32)', FF + 0xcf2b, FF + 0xcf32 + 7);
  for (const at of [0xcf3b, 0xd03e, 0xd3fe]) {
    const [ps, e] = wordTable(rom, FF + at, FF);
    t(`VWF string pointers ($FF:${hex4(at)})`, FF + at, e);
    for (const p of ps) t(`VWF string ($FF:${hex4(p)})`, FF + p, until0(rom, FF + p));
  }
  t('save-slot chapter thresholds ($FF:D024)', FF + 0xd024, FF + 0xd024 + 0x1a);
  t('save-slot header shifts ($C2:D329)', C2 + 0xd329, C2 + 0xd329 + 3);
  t('VWF font ($FF:2060, $FF:3860)', FF + 0x2060, FF + 0x3860 + 0x80 * 24);
  t('VWF column offsets and advances ($C2:5FE6-61E5)', C2 + 0x5fe6, C2 + 0x60e6 + 0x100);
};

/** The portraits, element plaques, cursor graphs, window programs and the menus' HDMA tables. */
const windowTables = (rom: Uint8Array, out: RomTable[]): void => {
  const t = (name: string, a: number, b: number): void => void out.push([name, a, b]);
  const tiles = bytesAt(rom, FF + 0xce70, 8);
  const pals = Array.from({ length: 8 }, (_, i) => wordAt(rom, FF + 0xce78 + 2 * i));
  const xs = bytesAt(rom, C2 + 0xa2c6, 8);
  t('portrait tiles, palettes ($FF:CE70, CE78)', FF + 0xce70, FF + 0xce88);
  t('plaque index ($C2:A2C6)', C2 + 0xa2c6, C2 + 0xa2ce);
  t('plaque words, palettes ($FF:CE88, CE92 + x)', FF + 0xce88, FF + 0xce92 + Math.max(...xs) + 2);
  for (let i = 0; i < 8; i += 1) {
    const a = FF + 32 * ((tiles[i] as number) - 1);
    t(`portrait ${i}`, a, a + 36 * 32);
    t(`portrait ${i} palette`, FF + (pals[i] as number), FF + (pals[i] as number) + 32);
  }
  for (const x of new Set(xs)) {
    const wd = wordAt(rom, FF + 0xce88 + x);
    const ep = wordAt(rom, FF + 0xce92 + x);
    if ((wd & 0x3ff) >= 0x100) {
      const a = FF + 0xd5e4 + 32 * ((wd & 0x3ff) - 0x100);
      t('plaque ($FF:D5E4, 12 tiles)', a, a + 12 * 32);
      t('plaque palette', FF + ep, FF + ep + 32);
    }
  }
  for (const g of [0xb63d, 0xb6b0, 0xb731, 0xb77a, 0xb7a5]) t(`cursor graph ($FF:${hex4(g)})`, FF + g, FF + g + 1 + byteAt(rom, FF + g));
  t('window program operand lengths ($FF:BD18)', FF + 0xbd18, FF + 0xbd18 + 0x15);
  t('save prompt window program ($FF:C16F)', FF + 0xc16f, windowProgram(rom, FF + 0xc16f));
  t('window cell pattern ($C2:EEF5, 4 x 4)', C2 + 0xeef5, C2 + 0xeef5 + 16);
  t('ribbon window ($FF:BAAA)', FF + 0xbaaa, hdmaRuns(rom, FF + 0xbaaa, 4));
  t('save prompt window ($FF:BAE3)', FF + 0xbae3, hdmaRuns(rom, FF + 0xbae3, 1));
  t('save screen registers ($FF:BCE6)', FF + 0xbce6, FF + 0xbce6 + 13);
  for (const [a, wdt] of [[0xb8a4, 2], [0xb9ca, 2], [0xb8ca, 2], [0xb9f0, 2], [0xbb33, 1]] as [number, number][]) {
    t(`shop HDMA ($FF:${hex4(a)})`, FF + a, hdmaRuns(rom, FF + a + 1, wdt));
  }
};

/** The pop-up, party places, item names and records, shops, exchange screen, treasure messages, dictionary and captions. */
const itemTables = (rom: Uint8Array, out: RomTable[]): void => {
  const t = (name: string, a: number, b: number): void => void out.push([name, a, b]);
  let a = FF + 0xceba + 0x2a;
  while ((byteAt(rom, a) & 0x80) === 0) a += 1;
  t('pop-up curve ($FF:CEBA)', FF + 0xceba, a + 1);
  t('pop-up digits ($FF:9390)', FF + 0x9390, FF + 0x9390 + 160);
  t('pop-up columns ($C2:90F8)', C2 + 0x90f8, C2 + 0x90f8 + 4);
  t('pop-up palettes ($FF:CB9C, CBAC)', FF + 0xcb9c, FF + 0xcbac + 8);
  t('item screen party ($C2:B045, 3 words)', C2 + 0xb045, C2 + 0xb045 + 6);
  t('tech screen partners ($C2:BB1A, 3)', C2 + 0xbb1a, C2 + 0xbb1a + 3);
  t('tech target party ($C2:BF2F, 3 words)', C2 + 0xbf2f, C2 + 0xbf2f + 6);
  t('Tab stat bytes ($C2:B315, X 0-6)', C2 + 0xb315, C2 + 0xb315 + 7);
  t('gear slot labels ($C2:A3BA, 4 x 10)', C2 + 0xa3ba, C2 + 0xa3ba + 40);
  t('item classes ($C2:88A7)', C2 + 0x88a7, C2 + 0x88a7 + 5);
  t('item names ($CC:0B5E, 11 x 256)', CC + 0x0b5e, CC + 0x0b5e + 11 * 256);
  const cls = [...bytesAt(rom, C2 + 0x88a7, 5), 0x100];
  for (let c = 0; c < 5; c += 1) {
    const base = wordAt(rom, FF + 0xcf0e + 2 * c);
    const stride = byteAt(rom, FF + 0xcf18 + c);
    t(`item records, class ${c}`, CC + base, CC + base + ((cls[c + 1] as number) - (cls[c] as number)) * stride);
  }
  const [ls, end] = wordTable(rom, CC + 0x2c6d, CC);
  t('shop list pointers ($CC:2C6D)', CC + 0x2c6d, end);
  for (const p of new Set(ls)) t(`shop list ($CC:${hex4(p)})`, CC + p, CC + p + 32);
  t('exchange map rows ($FF:F6F2, 6 words)', FF + 0xf6f2, FF + 0xf6f2 + 12);
  t('exchange palettes ($FF:F6FE 8, $FF:F706 16)', FF + 0xf6fe, FF + 0xf706 + 16);
  t('exchange wave ($FF:F759, x <= 7A)', FF + 0xf759, FF + 0xf759 + 0x7c);
  t('exchange HDMA seed ($FF:D57A, 12)', FF + 0xd57a, FF + 0xd57a + 12);
  t('treasure messages ($DE:FF00)', DE + 0xff00, DE + 0xff06);
  for (let i = 0; i < 3; i += 1) {
    const p = wordAt(rom, DE + 0xff00 + 2 * i);
    t('treasure message', DE + p, until0(rom, DE + p));
  }
  t('text dictionary pointers ($DE:FA00, 128)', DE + 0xfa00, DE + 0xfa00 + 256);
  for (let i = 0; i < 128; i += 1) {
    const ds = DE + wordAt(rom, DE + 0xfa00 + 2 * i);
    t('text dictionary entry', ds, ds + 1 + byteAt(rom, ds));
  }
  let cap = 0x3da000;
  for (let i = 0; i < 128; i += 1) {
    while ((byteAt(rom, cap) & 0x80) === 0) cap += 1;
    cap += 1;
  }
  t('caption records ($FD:A000, 128)', 0x3da000, cap);
};

/** rom_closure.menu_tables: the tables the menus and their text read, each extent the reading code's own index range or a walked program. */
const menuTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [];
  stringTables(rom, out);
  windowTables(rom, out);
  itemTables(rom, out);
  return out;
};

export { menuTables };
