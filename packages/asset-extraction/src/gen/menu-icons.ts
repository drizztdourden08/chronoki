/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { block16 } from './ctgen/block16';
import { rgb } from './ctgen/rgb';
import { peek } from './ctgen/peek';
import { cgramOf } from './ctgen/cgram-of';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';

const icon = (vram: Uint8Array, cg: Uint8Array, t: number): number[] =>
  block16(vram, 0x8000, t, t + 1, t + 16, t + 17).flatMap((i) => (i === 0 ? [0, 0, 0, 0] : [...rgb(cg, 128 + i), 255]));

const HEADER = [
  '// Menu ribbon icons from the oracle OBJ VRAM (chr $4000/byte $8000, OBJ pal 0). base 004..00E =',
  '// GREY unselected; highlight 024..02E = the SELECTED icon\'s REAL colors -- CT loads a DIFFERENT OBJ',
  '// pal0 per selection (each icon\'s own colours), so each highlight tile is decoded with the palette',
  '// from the state where THAT icon is selected (sel$i.state). See disasm/notes/menu_phase2.md.',
  '#ifndef CT_MENU_ICONS_H',
  '#define CT_MENU_ICONS_H',
  '#include <stdint.h>',
  '',
  'static const uint8_t ctMenuIconBase[6][16*16*4] = {',
];

/** tools/gen/menu_icons.py: the X menu's six ribbon icons (recipe menu_open_gato2, Right x i for icon i). */
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
