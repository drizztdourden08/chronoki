/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { rgb } from './ctgen/rgb';
import { tile4 } from './ctgen/tile4';
import { peek } from './ctgen/peek';
import { cgramOf } from './ctgen/cgram-of';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';
import { DRIVE, SINGLE, HEADER, TILES_DOC } from './menu-opt0.constants';

const genMenuOpt0 = async (ctx: ImportContext): Promise<string> => {
  const out = await peek(ctx, await recipeState(ctx, 'menu_open_gato2'), DRIVE);
  const cg = cgramOf(out);
  const tiles = new Map<number, number[]>();
  for (let n = 0x20; n < 0x2a; n += 1) tiles.set(n, tile4(out.vram, 0, n));
  const pal = Array.from({ length: 16 }, (_, i) => {
    const [r, g, b] = rgb(cg, i);
    return i === 0 ? 0 : (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
  });
  const lines = [...HEADER];
  for (const [name, n] of SINGLE) {
    lines.push(`static const uint8_t gen_opt0_icon_${name}[8*8] = { ${(tiles.get(n) as number[]).join(',')} };  // tile 0x${hx(n, 2)}`);
  }
  lines.push(`static const uint32_t gen_opt0_pal0[16] = { ${pal.map((c) => `0x${hx(c, 8)}`).join(', ')} };  // 0xAABBGGRR`);
  lines.push(...TILES_DOC);
  for (let n = 0x20; n < 0x2a; n += 1) lines.push(`  { ${(tiles.get(n) as number[]).join(',')} }, // 0x${hx(n, 2)}`);
  lines.push('};', '#endif', '');
  return lines.join('\n');
};

export { genMenuOpt0 };
