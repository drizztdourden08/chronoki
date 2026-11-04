/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/work-files';
import { makeXlat } from './xlat/xlat-make';

/** tools/gen/xlat_all.py <name>: one translated ROM program, written as src/xlat/<name>.c into the workdir. */
const xlatStage =
  (name: string): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, `src/xlat/${name}.c`, await makeXlat(ctx, name));
  };

/** The five xlat_all stages (they need the oracle with peek and cpuTrace). */
const XLAT_RUNNERS: Record<string, StageRun> = {
  seq_c3: xlatStage('seq_c3'),
  wipe_c3: xlatStage('wipe_c3'),
  owwin_c6: xlatStage('owwin_c6'),
  gwarp_fd: xlatStage('gwarp_fd'),
  hdma_fd: xlatStage('hdma_fd'),
};

export { XLAT_RUNNERS };
