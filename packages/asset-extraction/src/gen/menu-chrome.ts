/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { cgWord, tile4, x5 } from './ctgen/menugfx';
import { crlf, hx } from './ctgen/text-file';
import type { ChromeCaptures } from './menu-chrome-caps';
import { captureChrome, TMH, TMW } from './menu-chrome-caps';

const HEAD = [
  '// menu_chrome.h - BYTE-EXACT CT menu BG2 chrome, captured from the oracle (saves/menu_open_gato2;',
  '// mode-1 BG2 tilemap @VRAM word 0x6000, char base 0). NOTHING invented: the chrome tile graphics',
  '// (VRAM 0x300-0x3EF: 0x3A0-0x3A3 marble, 0x3A4-0x3AC ribbon box, 0x3DC-0x3EF the 9-slice window',
  '// panels, 0x300-0x313 the Save-slot buttons), the BG palettes (CGRAM; panels use rows 0 & 4, marble',
  '// + ribbon box row 7), and the per-screen BG2 tilemaps. Replaying a tilemap reproduces the marble',
  '// desktop + dark-blue window panels + the ribbon box pixel-identically (verified vs PEEK_ISOBG=1).',
  '// Generated from the oracle VRAM/CGRAM.',
  '#ifndef CT_MENU_CHROME_H',
  '#define CT_MENU_CHROME_H',
  '#include <stdint.h>',
  '#define CT_MENU_CHROME_TILE0 0x300',
  '#define CT_MENU_CHROME_NTILE 0xF0   /* tiles 0x300..0x3EF */',
  '#define CT_MENU_CHROME_TMW 32',
  '#define CT_MENU_CHROME_TMH 28',
  'static const uint8_t ctMenuChromePal[8][16][3] = {',
  '',
].join('\n');

const ENTERED_DOC = [
  '// Entered sub-screen per option (no ribbon box). BOTH gated screens are now the REAL entered',
  '// captures: opt5 (Save) from the overworld, where C2/CEDC lets it open (_gen_menuchrome_save.py),',
  "// and opt4 (Form) from a THREE-MEMBER field state, where C2/C627's ($0F0B + $0F0C) >= 2 finally",
  '// passes (_gen_menuchrome_form.py). Both used to hold REFUSED captures -- the ROM had bounced the',
  "// screen and what was stored was the ribbon's hover preview, leaving a rectangle of ribbon-box",
  '// cells that CtMenuChrome then skipped, i.e. a hole (menu_open_items.md 3.4/5).',
  '',
].join('\n');

const LABELS = [
  'opt0',
  'opt1',
  'opt2',
  'opt3',
  'opt4 -- the ENTERED Form screen (3-member capture): _gen_menuchrome_form.py',
  'opt5 -- the ENTERED Save screen (overworld capture): _gen_menuchrome_save.py',
];

const tmDecl = (name: string, dims: string): string =>
  `static const uint16_t ${name}[${dims}CT_MENU_CHROME_TMW*CT_MENU_CHROME_TMH] = {\n`;

const cell = (tm: number[], ty: number, tx: number): string => `0x${hx(tm[ty * TMW + tx] as number, 4)}`;

const plane = (tm: number[], label: string): string => {
  let s = `  { /* ${label} */\n`;
  for (let ty = 0; ty < TMH; ty += 1) s += `    ${Array.from({ length: TMW }, (_, tx) => cell(tm, ty, tx)).join(',')},\n`;
  return `${s}  },\n`;
};

const flat = (tm: number[]): string =>
  Array.from({ length: TMH }, (_, ty) => `  ${Array.from({ length: TMW }, (_, tx) => cell(tm, ty, tx)).join(', ')},\n`).join('');

const palettes = (cg0: Uint8Array): string =>
  Array.from({ length: 8 }, (_, p) => {
    const ent = Array.from({ length: 16 }, (_, k) => {
      const q = cgWord(cg0, p * 16 + k);
      return `{${x5(q & 31)},${x5((q >> 5) & 31)},${x5((q >> 10) & 31)}}`;
    });
    return `  {${ent.join(',')}},\n`;
  }).join('');

const tileRows = (vram0: Uint8Array): string => {
  let s = '';
  for (let t = 0x300; t < 0x3f0; t += 1) s += `  {${tile4(vram0, 0, t).join(',')}}, /* ${hx(t, 3)} */\n`;
  return s;
};

const render = (c: ChromeCaptures): string =>
  HEAD +
  palettes(c.cg0) +
  '};\n' +
  'static const uint8_t ctMenuChromeTile[CT_MENU_CHROME_NTILE][64] = {\n' +
  tileRows(c.vram0) +
  '};\n' +
  "// Main-menu RIBBON view per option: marble + that option's panels + the ribbon box (center).\n" +
  tmDecl('ctMenuChromeRibbonTM', '6][') +
  c.ribbon.map((tm, n) => plane(tm, `opt${n}`)).join('') +
  '};\n' +
  ENTERED_DOC +
  tmDecl('ctMenuChromeEnteredTM', '6][') +
  c.entered.map((tm, n) => plane(tm, LABELS[n] as string)).join('') +
  '};\n' +
  '\n// --- ENTERED EQUIP/STATUS detail chrome (3-box left column) : _gen_menuchrome_equip.py ---\n' +
  tmDecl('ctMenuChromeEquipTM', '') +
  flat(c.equip) +
  '};\n' +
  '// --- EQUIP CANDIDATE-LIST (ROM substate 3) chrome : _gen_menuchrome_equiplist.py ---\n' +
  tmDecl('ctMenuChromeEquipListTM', '') +
  flat(c.equipList) +
  '};\n' +
  "// --- SCREEN $07, THE PARTY EXCHANGE (menu mode 5, C2/C7A6): the field's Y at storyline 0x49 [gato_wait] ---\n" +
  tmDecl('ctMenuChromeExchTM', '') +
  flat(c.exchange) +
  '};\n' +
  '\n#endif\n';

/** tools/gen/menu_chrome.py: the X menu's BG2 chrome (tiles, palettes, every screen's BG2 tilemap) off the oracle. */
const genMenuChrome = async (ctx: ImportContext): Promise<string> => crlf(render(await captureChrome(ctx)));

export { genMenuChrome };
