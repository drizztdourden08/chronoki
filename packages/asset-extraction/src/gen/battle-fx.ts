/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import { headText, FLASH_FRAME } from './battle-fx/fx-head';
import { palText, tailText } from './battle-fx/fx-pal';
import type { GenFiles } from './oracle-gen-stage';
import { cgramOf } from './shared/fb-decode';

const BAKE_FRAME = 540;
const AON = 16;
const AOFF = 16;

/** build(F): the A-mash button script that boots the GATO fight, cut to F frames. */
const build = (frames: number): string => {
  const seq: string[] = [];
  let n = 0;
  while (n < frames) {
    const on = Math.min(AON, frames - n);
    if (on) {
      seq.push(`100:${on}`);
      n += on;
    }
    if (n >= frames) break;
    const off = Math.min(AOFF, frames - n);
    if (off) {
      seq.push(`0:${off}`);
      n += off;
    }
  }
  return seq.join(',');
};

/** tools/gen/battle_fx.py: the battle action-feedback digit popup, MISS glyph and palettes (src/data/battle_fx.h). */
const genBattleFx = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'battle_gato_press_action');
  const oracle = peekOracle(ctx);
  const bake = await oracle.peek({ state, script: build(BAKE_FRAME) });
  const flash = await oracle.peek({ state, script: build(FLASH_FRAME) });
  const text = headText(bake.vram) + palText(ctx.rom, cgramOf(bake.oam)) + tailText(cgramOf(flash.oam));
  return { 'battle_fx.h': text };
};

export { genBattleFx };
