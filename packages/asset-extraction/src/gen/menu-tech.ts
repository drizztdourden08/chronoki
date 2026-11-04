/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { rgb } from './ctgen/rgb';
import { tile4 } from './ctgen/tile4';
import { peek } from './ctgen/peek';
import { cgramOf } from './ctgen/cgram-of';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';

const DRIVE = '80:2,0:4,80:2,0:4,100:2,0:40';

const HEADER = [
  '// gen_tech.h - AUTO-EXTRACTED from oracle VRAM (tech_enter state: menu_open_gato2 + Right x2 + A).',
  "// The three 'Single/Dual/Triple' category TABS at the tech screen's top-right.",
  '// Each tab = 2x2 = 16x16 px, four 8x8 4bpp tiles in order {TL,TR,BL,BR} (VRAM tiles 0x164..0x16F).',
  '// Palette: SELECTED tab -> techTabPal[0] (CGRAM row4), UNSELECTED -> techTabPal[1] (CGRAM row5).',
  '// Pixel index 0 = transparent (shows panel bg). Indices 1..15 -> techTabPal[sel][idx].',
  '#ifndef GEN_TECH_H',
  '#define GEN_TECH_H',
  '#include <stdint.h>',
  '// 12 tiles x 64 nibble-indices (row-major 8x8). Groups of 4 = tab 1,2,3.',
  'static const uint8_t techTabTiles[12][64] = {',
];

/** tools/gen/menu_tech.py: the Tech screen's Single/Dual/Triple tabs (recipe menu_open_gato2, Right x2, A). */
const genMenuTech = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), DRIVE);
  const cg = cgramOf(out);
  const lines = [...HEADER];
  for (let n = 0x164; n < 0x170; n += 1) lines.push(`  {${tile4(out.vram, 0, n).join(',')}}, // tile 0x${hx(n, 3)}`);
  lines.push(
    '};',
    '// [0]=selected(CGRAM row4), [1]=unselected(row5); 16 colors RGB888 (idx0 transparent).',
    'static const uint8_t techTabPal[2][16][3] = {',
  );
  for (const row of [4, 5]) {
    const cells = Array.from({ length: 16 }, (_, i) => `{${rgb(cg, row * 16 + i).join(',')}}`);
    lines.push(`  { ${cells.join(', ')} },`);
  }
  lines.push(
    '};',
    '// Screen placement (OUR 256x224 coords): tab i top-left = (144 + i*32, 24), size 16x16.',
    'static const uint16_t techTabX[3] = {144,176,208};',
    '#define TECH_TAB_Y 24',
    '#endif',
  );
  return lines.join('\n');
};

export { genMenuTech };
