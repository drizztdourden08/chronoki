/* @layer shared-asset-extraction @kind logic */
import { peekOracle } from '../oracle/peek-access';
import { recipeState } from '../oracle/recipe-state';
import type { StageRun } from '../pipeline/stage.type';
import { runTool } from './run-tool';

const owWorldStage: StageRun = async (ctx) => {
  const oracle = peekOracle(ctx);
  const pan = await recipeState(ctx, 'ow_intro_pan');
  const w0 = await recipeState(ctx, 'ow_nav_w0');
  const put = (name: string, data: Uint8Array): Promise<void> => ctx.work.writeBytes(`saves/${name}`, data);

  const intro = await oracle.peek({ state: pan, script: '0:1', rule: false });
  await put('ow_w0.live.wram', intro.wram);
  await put('ow_w0.intro.wram', intro.wram);
  const live = await oracle.peek({ state: w0, script: '0:1', rule: false });
  await put('ow_w0.live.wram.bak', live.wram);
  await put('ow_w0.live.vram', live.vram);
  for (let n = 1; n < 8; n += 1) {
    const args = ['--owforce', '{state}', String(n), `{out:ow_w${n}}`];
    const got = await runTool(ctx, 'ow_world', args, [`ow_w${n}.wram`, `ow_w${n}.vram`], w0);
    await put(`ow_w${n}.live.wram`, got[`ow_w${n}.wram`] as Uint8Array);
    await put(`ow_w${n}.live.vram`, got[`ow_w${n}.vram`] as Uint8Array);
  }
  ctx.log('ow_world: worlds 0-7 -> saves');
};

export { owWorldStage };
