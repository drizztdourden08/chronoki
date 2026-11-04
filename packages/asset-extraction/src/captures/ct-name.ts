/* @layer shared-asset-extraction @kind logic */
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import type { StageRun } from '../pipeline/stage.type';

const cropRgb = (fb: Uint8Array, head: number[], x0: number, y0: number, w: number, h: number): Uint8Array => {
  const out = new Uint8Array(head.length * 2 + w * h * 3);
  head.forEach((v, i) => {
    out[i * 2] = v & 0xff;
    out[i * 2 + 1] = v >> 8;
  });
  let p = head.length * 2;
  for (let j = 0; j < h; j += 1) {
    for (let i = 0; i < w; i += 1) {
      const o = (2 * (y0 + j) * 512 + 2 * (x0 + i)) * 4;
      out.set([fb[o + 3] as number, fb[o + 2] as number, fb[o + 1] as number], p);
      p += 3;
    }
  }
  return out;
};

const ctNameWinStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_lucca');
  const shot = await peekOracle(ctx).peek({ state, script: null, env: { PEEK_ISOBG: '1' }, frames: 1 });
  await ctx.work.writeBytes('saves/ct_namewin.bin', cropRgb(shot.fb, [256, 224], 0, 0, 256, 224));
};

const X0 = 16;
const Y0 = 104;
const W = 224;
const H = 48;

const ctNameMsgStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_crono');
  const shot = await peekOracle(ctx).peek({ state, script: null, frames: 20 });
  await ctx.work.writeBytes('saves/ct_namemsg.bin', cropRgb(shot.fb, [X0, Y0, W, H], X0, Y0, W, H));
};

export { ctNameMsgStage, ctNameWinStage };
