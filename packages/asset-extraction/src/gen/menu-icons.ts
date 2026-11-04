/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { block16, rgb } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';
import { hx } from './ctgen/text-file';
import { HEADER } from './menu-icons.constants';

const icon = (vram: Uint8Array, cg: Uint8Array, t: number): number[] =>
  block16(vram, 0x8000, t, t + 1, t + 16, t + 17).flatMap((i) => (i === 0 ? [0, 0, 0, 0] : [...rgb(cg, 128 + i), 255]));

const genMenuIcons = async (ctx: ImportContext): Promise<string> => {
  const state = await recipeState(ctx, 'menu_open_gato2');
  let base: number[][] | null = null;
  const sel: number[][] = [];
  for (let i = 0; i < 6; i += 1) {
    const out = await peek(ctx, state, i ? `(80:2,0:8)*${i},0:12` : '0:2');
    const cg = cgramOf(out);
    const tile = out.oam[i * 4 + 2] as number;
    if (tile !== 0x24 + 2 * i) {
      throw new Error(`menu_icons: icon ${i} is not the selected one after Right x${i} (OAM ${i} tile ${hx(tile, 2)})`);
    }
    base ??= [0, 1, 2, 3, 4, 5].map((k) => icon(out.vram, cg, 4 + 2 * k));
    sel.push(icon(out.vram, cg, 0x24 + 2 * i));
  }
  const lines = [...HEADER];
  for (let k = 0; k < 6; k += 1) lines.push(`  { /* tile ${hx(4 + 2 * k, 2)} */ ${(base as number[][])[k]?.join(',')} },`);
  lines.push('};', '', 'static const uint8_t ctMenuIconSel[6][16*16*4] = {');
  for (let k = 0; k < 6; k += 1) lines.push(`  { /* tile ${hx(0x24 + 2 * k, 2)} */ ${sel[k]?.join(',')} },`);
  lines.push('};', '', '#endif', '');
  return lines.join('\n');
};

export { genMenuIcons };
