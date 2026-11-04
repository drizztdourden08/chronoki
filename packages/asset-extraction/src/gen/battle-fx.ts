/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import { headText } from './battle-fx/fx-head';
import { FLASH_FRAME } from './battle-fx/fx-head.constants';
import { palText } from './battle-fx/fx-pal';
import { tailText } from './battle-fx/fx-tail';
import type { GenFiles } from './oracle-gen-stage.type';
import { cgramOf } from './shared/fb-decode';
import { BAKE_FRAME, AON, AOFF } from './battle-fx.constants';

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

const genBattleFx = async (ctx: ImportContext): Promise<GenFiles> => {
  const state = await recipeState(ctx, 'battle_gato_press_action');
  const oracle = peekOracle(ctx);
  const bake = await oracle.peek({ state, script: build(BAKE_FRAME), rule: false });
  const flash = await oracle.peek({ state, script: build(FLASH_FRAME), rule: false });
  const text = headText(bake.vram) + palText(ctx.rom, cgramOf(bake.oam)) + tailText(cgramOf(flash.oam));
  return { 'battle_fx.h': text };
};

export { genBattleFx };
