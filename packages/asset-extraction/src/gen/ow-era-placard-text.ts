/* @layer shared-asset-extraction @kind logic */
import { hx } from './ctgen/hx';
import { HEADER } from './ow-era-placard-text.constants';
import type { Placard } from './ow-era-placard-text.type';

const padded = (p: Placard, maxw: number): number[] => {
  const out: number[] = [];
  for (let ty = 0; ty < 16; ty += 1) {
    out.push(...p.px.subarray(ty * p.w * 4, (ty + 1) * p.w * 4));
    for (let k = 0; k < (maxw - p.w) * 4; k += 1) out.push(0);
  }
  return out;
};

const pixelBlock = (p: Placard, maxw: number): string => {
  const pad = padded(p, maxw);
  let s = `  { /* $${hx(p.era, 2)} */\n    `;
  for (let i = 0; i < pad.length; i += 32) {
    s += pad.slice(i, i + 32).join(',');
    s += i + 32 < pad.length ? ',\n    ' : '\n';
  }
  return `${s}  },\n`;
};

const renderPlacards = (eras: Placard[]): string => {
  const maxw = Math.max(...eras.map((p) => p.w));
  let s = HEADER;
  s += `#define CT_PLACARD_N ${eras.length}\n`;
  s += `#define CT_PLACARD_MAXW ${maxw}\n`;
  s += '#define CT_PLACARD_H 16\n';
  s += "// { era id, screen x of the strip, width }.  y is the object's own Y ($C0 = 192) and\n// every shipped piece has dY = 0.\n";
  s += 'static const unsigned short ctPlacardEra[CT_PLACARD_N][3] = {\n';
  for (const p of eras) {
    s += `  { 0x${hx(p.era, 2)}, ${String(p.x0).padStart(3)}, ${String(p.w).padStart(3)} },   /* ${p.seenIn.padEnd(28)} ${p.shape} */\n`;
  }
  s += '};\n';
  s += "// RGBA, 16 rows of CT_PLACARD_MAXW (only each row's own width is meaningful);\n// alpha 0 = the OBJ backdrop (transparent).\n";
  s += 'static const unsigned char ctPlacardPx[CT_PLACARD_N][16 * CT_PLACARD_MAXW * 4] = {\n';
  for (const p of eras) s += pixelBlock(p, maxw);
  return `${s}};\n`;
};

export { renderPlacards };
