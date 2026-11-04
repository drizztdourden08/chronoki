/* @layer shared-asset-extraction @kind logic */
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import type { StageRun } from '../pipeline/stage.type';
import { cropRgb } from './crop-rgb';

const X0 = 16;
const Y0 = 104;
const W = 224;
const H = 48;

const ctNameMsgStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_crono');
  const shot = await peekOracle(ctx).peek({ state, script: null, frames: 20 });
  await ctx.work.writeBytes('saves/ct_namemsg.bin', cropRgb(shot.fb, [X0, Y0, W, H], X0, Y0, W, H));
};

export { ctNameMsgStage };
