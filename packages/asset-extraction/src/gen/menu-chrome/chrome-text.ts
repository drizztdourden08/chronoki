/* @layer shared-asset-extraction @kind logic */
import { hexN } from '../shared/py-format';

const TMW = 32;
const TMH = 28;

const HEAD = `// menu_chrome.h - BYTE-EXACT CT menu BG2 chrome, captured from the oracle (saves/menu_open_gato2;
// mode-1 BG2 tilemap @VRAM word 0x6000, char base 0). NOTHING invented: the chrome tile graphics
// (VRAM 0x300-0x3EF: 0x3A0-0x3A3 marble, 0x3A4-0x3AC ribbon box, 0x3DC-0x3EF the 9-slice window
// panels, 0x300-0x313 the Save-slot buttons), the BG palettes (CGRAM; panels use rows 0 & 4, marble
// + ribbon box row 7), and the per-screen BG2 tilemaps. Replaying a tilemap reproduces the marble
// desktop + dark-blue window panels + the ribbon box pixel-identically (verified vs PEEK_ISOBG=1).
// Generated from the oracle VRAM/CGRAM.
#ifndef CT_MENU_CHROME_H
#define CT_MENU_CHROME_H
#include <stdint.h>
#define CT_MENU_CHROME_TILE0 0x300
#define CT_MENU_CHROME_NTILE 0xF0   /* tiles 0x300..0x3EF */
#define CT_MENU_CHROME_TMW 32
#define CT_MENU_CHROME_TMH 28
static const uint8_t ctMenuChromePal[8][16][3] = {
`;

const ENTERED_DOC = `// Entered sub-screen per option (no ribbon box). BOTH gated screens are now the REAL entered
// captures: opt5 (Save) from the overworld, where C2/CEDC lets it open (_gen_menuchrome_save.py),
// and opt4 (Form) from a THREE-MEMBER field state, where C2/C627's ($0F0B + $0F0C) >= 2 finally
// passes (_gen_menuchrome_form.py). Both used to hold REFUSED captures -- the ROM had bounced the
// screen and what was stored was the ribbon's hover preview, leaving a rectangle of ribbon-box
// cells that CtMenuChrome then skipped, i.e. a hole (menu_open_items.md 3.4/5).
`;

const LABELS = [
  'opt0',
  'opt1',
  'opt2',
  'opt3',
  'opt4 -- the ENTERED Form screen (3-member capture): _gen_menuchrome_form.py',
  'opt5 -- the ENTERED Save screen (overworld capture): _gen_menuchrome_save.py',
];

const conv = (x: number): number => (x << 3) | (x >> 2);

const paletteText = (cg: Uint8Array): string => {
  let s = '';
  for (let p = 0; p < 8; p += 1) {
    const ent: string[] = [];
    for (let k = 0; k < 16; k += 1) {
      const q = (cg[(p * 16 + k) * 2] as number) | ((cg[(p * 16 + k) * 2 + 1] as number) << 8);
      ent.push(`{${conv(q & 31)},${conv((q >> 5) & 31)},${conv((q >> 10) & 31)}}`);
    }
    s += `  {${ent.join(',')}},\n`;
  }
  return s;
};

const tilesText = (vram: Uint8Array): string => {
  let s = '';
  for (let t = 0x300; t < 0x3f0; t += 1) {
    const o = t * 32;
    const px: number[] = [];
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const b = 7 - x;
        px.push(
          (((vram[o + y * 2] as number) >> b) & 1) |
            ((((vram[o + y * 2 + 1] as number) >> b) & 1) << 1) |
            ((((vram[o + 16 + y * 2] as number) >> b) & 1) << 2) |
            ((((vram[o + 16 + y * 2 + 1] as number) >> b) & 1) << 3),
        );
      }
    }
    s +=`  {${px.join(',')}}, /* ${hexN(t, 3)} */\n`;
  }
  return s;
};

const plane = (tm: number[], label: string): string => {
  let s = `  { /* ${label} */\n`;
  for (let ty = 0; ty < TMH; ty += 1) {
    s += `    ${tm.slice(ty * TMW, ty * TMW + TMW).map((v) => `0x${hexN(v, 4)}`).join(',')},\n`;
  }
  return `${s}  },\n`;
};

const flat = (tm: number[]): string => {
  let s = '';
  for (let ty = 0; ty < TMH; ty += 1) {
    s += `  ${tm.slice(ty * TMW, ty * TMW + TMW).map((v) => `0x${hexN(v, 4)}`).join(', ')},\n`;
  }
  return s;
};

const TM = (name: string, dims: string): string =>
  `static const uint16_t ${name}[${dims}CT_MENU_CHROME_TMW*CT_MENU_CHROME_TMH] = {\n`;

interface ChromeCaps {
  cg0: Uint8Array;
  vram0: Uint8Array;
  rib: number[][];
  ent: number[][];
  eq: number[];
  eql: number[];
  exc: number[];
}

/** The whole header text (menu_chrome.py's `text`), with "\n" line ends. */
const chromeText = (c: ChromeCaps): string =>
  HEAD +
  paletteText(c.cg0) +
  '};\n' +
  'static const uint8_t ctMenuChromeTile[CT_MENU_CHROME_NTILE][64] = {\n' +
  tilesText(c.vram0) +
  '};\n' +
  "// Main-menu RIBBON view per option: marble + that option's panels + the ribbon box (center).\n" +
  TM('ctMenuChromeRibbonTM', '6][') +
  c.rib.map((t, n) => plane(t, `opt${n}`)).join('') +
  '};\n' +
  ENTERED_DOC +
  TM('ctMenuChromeEnteredTM', '6][') +
  c.ent.map((t, n) => plane(t, LABELS[n] as string)).join('') +
  '};\n' +
  '\n// --- ENTERED EQUIP/STATUS detail chrome (3-box left column) : _gen_menuchrome_equip.py ---\n' +
  TM('ctMenuChromeEquipTM', '') +
  flat(c.eq) +
  '};\n' +
  '// --- EQUIP CANDIDATE-LIST (ROM substate 3) chrome : _gen_menuchrome_equiplist.py ---\n' +
  TM('ctMenuChromeEquipListTM', '') +
  flat(c.eql) +
  '};\n' +
  "// --- SCREEN $07, THE PARTY EXCHANGE (menu mode 5, C2/C7A6): the field's Y at storyline 0x49 [gato_wait] ---\n" +
  TM('ctMenuChromeExchTM', '') +
  flat(c.exc) +
  '};\n' +
  '\n#endif\n';

export type { ChromeCaps };
export { chromeText };
