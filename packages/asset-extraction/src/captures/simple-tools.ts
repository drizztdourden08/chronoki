/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { runTool } from './capture-io';

/** A capture that is one ct.exe tool mode writing one file: gen/snd_timing.py, gen/anim_oplen.py. */
const toolFileStage =
  (name: string, mode: string, file: string): StageRun =>
  async (ctx) => {
    const got = await runTool(ctx, name, [mode, `{out:${name}.bin}`], [`${name}.bin`]);
    await ctx.work.writeBytes(file, got[`${name}.bin`] as Uint8Array);
  };

/** saves/snd_timing.bin: the sound machine's cost table (ct.exe --sndtiming). */
const sndTimingStage = toolFileStage('snd_timing', '--sndtiming', 'saves/snd_timing.bin');

/** saves/anim_oplen.bin: the battle anim interpreter's opcode lengths (ct.exe --animoplen). */
const animOpLenStage = toolFileStage('anim_oplen', '--animoplen', 'saves/anim_oplen.bin');

export { animOpLenStage, sndTimingStage };
