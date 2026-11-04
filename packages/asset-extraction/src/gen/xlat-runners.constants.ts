/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/write-text';
import { makeXlat } from './xlat/xlat-make';

const xlatStage =
  (name: string): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, `src/xlat/${name}.c`, await makeXlat(ctx, name));
  };
const XLAT_RUNNERS: Record<string, StageRun> = {
  seq_c3: xlatStage('seq_c3'),
  wipe_c3: xlatStage('wipe_c3'),
  owwin_c6: xlatStage('owwin_c6'),
  gwarp_fd: xlatStage('gwarp_fd'),
  hdma_fd: xlatStage('hdma_fd'),
};

export { xlatStage, XLAT_RUNNERS };
