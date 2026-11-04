/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peek } from './ctgen/peek';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';
import { DRIVE, BASE, HEADER } from './menu-itemoverlay.constants';

const genMenuItemoverlay = async (ctx: ImportContext): Promise<string> => {
  const { vram } = await peek(ctx, await recipeState(ctx, 'grupo_3_mapa'), DRIVE);
  const lines = [...HEADER];
  for (let r = 32; r < 48; r += 1) {
    const row: string[] = [];
    for (let c = 2; c < 16; c += 1) {
      const o = BASE + (r * 32 + c) * 2;
      const w = (vram[o] as number) | ((vram[o + 1] as number) << 8);
      const tile = w & 0x3ff;
      if (tile < 0x3dc || tile > 0x3ef) {
        throw new Error(`menu_itemoverlay: not a window tile at (${c},${r}): ${hx(w, 4)} -- the overlay is not up`);
      }
      row.push(`0x${hx(w, 4)}`);
    }
    lines.push(`  { ${row.join(', ')} },`);
  }
  lines.push('};', '#endif', '');
  return lines.join('\n');
};

export { genMenuItemoverlay };
