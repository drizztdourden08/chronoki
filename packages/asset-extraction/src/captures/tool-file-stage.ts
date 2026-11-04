/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { runTool } from './run-tool';

const toolFileStage =
  (name: string, mode: string, file: string): StageRun =>
  async (ctx) => {
    const got = await runTool(ctx, name, [mode, `{out:${name}.bin}`], [`${name}.bin`]);
    await ctx.work.writeBytes(file, got[`${name}.bin`] as Uint8Array);
  };

export { toolFileStage };
