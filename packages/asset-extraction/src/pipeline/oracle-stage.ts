/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from './stage.type';

const oracleStage: StageRun = async (ctx) => {
  if (ctx.oracle === null) throw new Error('no oracle is available');
  await ctx.oracle.boot(ctx.rom);
};

export { oracleStage };
