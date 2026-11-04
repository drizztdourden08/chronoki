/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { buildCtWide } from './steam-wide';

/** setup.py's Steam step: never a reason to fail the setup. Without a Steam copy the option stays off. */
const steamMarginsStage: StageRun = async (ctx) => {
  if (!ctx.steam) {
    ctx.log('the Steam margins: no Steam copy of Chrono Trigger found -- the option stays off (optional)');
    return;
  }
  try {
    await ctx.work.writeBytes(`${ctx.outDir}/ct_wide.dat`, await buildCtWide(ctx.steam));
  } catch (error) {
    ctx.log(`the Steam margins: could not read that copy -- the option stays off (optional): ${String(error)}`);
  }
};

export { steamMarginsStage };
