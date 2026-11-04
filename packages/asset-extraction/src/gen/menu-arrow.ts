/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { block16, rgb } from './ctgen/menugfx';
import { cgramOf, peek, recipeState } from './ctgen/require-tools';

const DRIVE = '0:2';

const HEADER = [
  '// menu_arrow.h - the ribbon SELECTION cursor arrow (the ▼/▲ straddling the highlighted icon).',
  '// The oracle OBJ sprite tile 0x22 (16x16, OBJ pal7), extracted from VRAM. It is a filled up-pointing',
  '// triangle (▲) occupying rows 1-12 of the 16x16 cell (rows 0,13-15 transparent) -- so blitting the',
  '// whole cell at the OAM Y auto-positions the tip next to the icon. Bottom arrow = as-is at OAM Y=128;',
  '// top arrow = vertically flipped (▼) at OAM Y=96; both at X=81+opt*16. RGBA8888, A=0 transparent.',
  "// The mid grey is BGR555 (13,12,12) through the framebuffer's (v<<3)|(v>>2) = 107,99,99 (it was baked as",
  "// 106,98,98 = v*255/31); measured 2026-09-24 on the oracle's ribbon and shop frames.",
  '#ifndef CT_MENU_ARROW_H',
  '#define CT_MENU_ARROW_H',
  '#include <stdint.h>',
  'static const uint8_t ctMenuArrow[16*16*4] = {',
];

/** tools/gen/menu_arrow.py: the ribbon's selection arrow, from the oracle's OAM, VRAM and CGRAM (recipe menu_open_gato2). */
const genMenuArrow = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), DRIVE);
  const cg = cgramOf(out);
  const s = out.oam.subarray(6 * 4, 6 * 4 + 4);
  if (s[1] !== 128 || s[2] !== 0x22 || ((s[3] as number) & 0x0f) !== 0x0e) {
    const hex = Array.from(s, (b) => b.toString(16).padStart(2, '0')).join('');
    throw new Error(`menu_arrow: OBJ 6 is not the ribbon arrow (Y=128, tile 22, pal 7): ${hex}`);
  }
  const idx = block16(out.vram, 0x8000, 0x22, 0x23, 0x32, 0x33);
  const lines = [...HEADER];
  for (let y = 0; y < 16; y += 1) {
    const cells = idx.slice(y * 16, y * 16 + 16).map((i) => (i === 0 ? [0, 0, 0, 0] : [...rgb(cg, 128 + 7 * 16 + i), 255]));
    lines.push(`  ${cells.map((c) => `${c.join(',')},`).join('')}`);
  }
  lines.push('};', '#endif', '');
  return lines.join('\n');
};

export { genMenuArrow };
