/* @layer shared-asset-extraction @kind logic */
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import type { StageRun } from '../pipeline/stage.type';
import { cropRgb } from './crop-rgb';

const ctNameWinStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_lucca');
  const shot = await peekOracle(ctx).peek({ state, script: null, env: { PEEK_ISOBG: '1' }, frames: 1 });
  await ctx.work.writeBytes('saves/ct_namewin.bin', cropRgb(shot.fb, [256, 224], { x0: 0, y0: 0, w: 256, h: 224 }));
};

export { ctNameWinStage };
