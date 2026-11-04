/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import type { StageRun } from '../../pipeline/stage.type';
import { writeText } from '../../pipeline/work-files';

/** A generator that reads the oracle (through the context) and writes src/data/<file>.h into the workdir. */
const ctxTextStage =
  (file: string, gen: (ctx: ImportContext) => Promise<string>): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, `src/data/${file}.h`, await gen(ctx));
  };

export { ctxTextStage };
