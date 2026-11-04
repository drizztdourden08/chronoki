/* @layer shared-asset-extraction @kind logic */
import { hexN } from '../shared/hex-n';
import { TMW, TMH, HEAD, ENTERED_DOC, LABELS } from './chrome-text.constants';
import type { ChromeCaps } from './chrome-text.type';

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

const tmDecl = (name: string, dims: string): string =>
  `static const uint16_t ${name}[${dims}CT_MENU_CHROME_TMW*CT_MENU_CHROME_TMH] = {\n`;

const chromeText = (c: ChromeCaps): string =>
  [
    HEAD,
    paletteText(c.cg0),
    '};\n',
    'static const uint8_t ctMenuChromeTile[CT_MENU_CHROME_NTILE][64] = {\n',
    tilesText(c.vram0),
    '};\n',
    "// Main-menu RIBBON view per option: marble + that option's panels + the ribbon box (center).\n",
    tmDecl('ctMenuChromeRibbonTM', '6]['),
    c.rib.map((t, n) => plane(t, `opt${n}`)).join(''),
    '};\n',
    ENTERED_DOC,
    tmDecl('ctMenuChromeEnteredTM', '6]['),
    c.ent.map((t, n) => plane(t, LABELS[n] as string)).join(''),
    '};\n',
    '\n// --- ENTERED EQUIP/STATUS detail chrome (3-box left column) : _gen_menuchrome_equip.py ---\n',
    tmDecl('ctMenuChromeEquipTM', ''),
    flat(c.eq),
    '};\n',
    '// --- EQUIP CANDIDATE-LIST (ROM substate 3) chrome : _gen_menuchrome_equiplist.py ---\n',
    tmDecl('ctMenuChromeEquipListTM', ''),
    flat(c.eql),
    '};\n',
    "// --- SCREEN $07, THE PARTY EXCHANGE (menu mode 5, C2/C7A6): the field's Y at storyline 0x49 [gato_wait] ---\n",
    tmDecl('ctMenuChromeExchTM', ''),
    flat(c.exc),
    '};\n',
    '\n#endif\n',
  ].join('');

export { chromeText };
