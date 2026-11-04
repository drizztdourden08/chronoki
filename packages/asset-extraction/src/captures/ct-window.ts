/* @layer shared-asset-extraction @kind logic */
import { peekOracle, recipeState } from '../oracle/peek-access';
import type { StageRun } from '../pipeline/stage.type';
import { rgbOfFb } from './capture-io';
import { TOP, LIFT_X, LIFT_Y, PERIOD } from './ct-window.constants';

const H = 80;

const ctWindowStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_mom_box');
  const shot = await peekOracle(ctx).peek({ state, script: null, env: { PEEK_ISOBG: '0' }, frames: 1 });
  const win = rgbOfFb(shot.fb).slice(TOP * 768, (TOP + H) * 768);
  for (let y = LIFT_Y[0]; y < LIFT_Y[1]; y += 1) {
    for (let x = LIFT_X[0]; x < LIFT_X[1]; x += 1) {
      const o = (y * 256 + x) * 3;
      win.copyWithin(o, o + PERIOD * 3, o + PERIOD * 3 + 3);
    }
  }
  const out = new Uint8Array(1 + win.length);
  out[0] = H;
  out.set(win, 1);
  await ctx.work.writeBytes('saves/ct_window.bin', out);
};

export { ctWindowStage };
