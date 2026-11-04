/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import type { GenFiles } from './oracle-gen-stage.type';
import { cgramOf } from './shared/fb-decode';
import { block16 } from './shared/block16';
import { cgramRgb } from './shared/cgram-rgb';
import { HEAD } from './menu-arrow.constants';

const genMenuArrow = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'menu_open_gato2');
  const dump = await peekOracle(ctx).peek({ state, script: '0:2', rule: true });
  const cg = cgramOf(dump.oam);
  const s = dump.oam.subarray(6 * 4, 6 * 4 + 4);
  if (s[1] !== 128 || s[2] !== 0x22 || ((s[3] as number) & 0x0f) !== 0x0e) {
    throw new Error(`menu_arrow: OBJ 6 is not the ribbon arrow (Y=128, tile 22, pal 7): ${Array.from(s, (b) => b.toString(16).padStart(2, '0')).join('')}`);
  }
  const idx = block16(dump.vram, 0x8000, 0x22, 0x23, 0x32, 0x33);
  const L = [...HEAD];
  for (let y = 0; y < 16; y += 1) {
    L.push(
      `  ${idx
        .slice(y * 16, y * 16 + 16)
        .map((i) => `${(i === 0 ? [0, 0, 0, 0] : [...cgramRgb(cg, 128 + 7 * 16 + i), 255]).join(',')},`)
        .join('')}`,
    );
  }
  L.push('};', '#endif', '');
  return { 'menu_arrow.h': L.join('\n') };
};

export { genMenuArrow };
