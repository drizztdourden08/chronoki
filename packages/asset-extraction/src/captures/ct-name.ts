/* @layer shared-asset-extraction @kind logic */
import { peekOracle, recipeState } from '../oracle/peek-access';
import type { StageRun } from '../pipeline/stage.type';

/** The w x h RGB crop at (x0, y0) of a 512x480 [pad,B,G,R] framebuffer dump (2x doubled), after a header of u16 LE words. */
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

/** gen/ct_namewin.py: saves/ct_namewin.bin, the naming screen's BG2 alone (PEEK_ISOBG=1), [w u16][h u16] + 256x224 RGB. */
const ctNameWinStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_lucca');
  const shot = await peekOracle(ctx).peek({ state, script: null, env: { PEEK_ISOBG: '1' }, frames: 1 });
  await ctx.work.writeBytes('saves/ct_namewin.bin', cropRgb(shot.fb, [256, 224], 0, 0, 256, 224));
};

const X0 = 16;
const Y0 = 104;
const W = 224;
const H = 48;

/** gen/ct_namemsg.py: saves/ct_namemsg.bin, the "Enter a name" prompt box, [x0,y0,w,h u16] + RGB, 20 frames in. */
const ctNameMsgStage: StageRun = async (ctx) => {
  const state = await recipeState(ctx, 'name_crono');
  const shot = await peekOracle(ctx).peek({ state, script: null, frames: 20 });
  await ctx.work.writeBytes('saves/ct_namemsg.bin', cropRgb(shot.fb, [X0, Y0, W, H], X0, Y0, W, H));
};

export { ctNameMsgStage, ctNameWinStage };
