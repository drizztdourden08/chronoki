/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import type { StageRun } from '../../pipeline/stage.type';
import { writeText } from '../../pipeline/write-text';

const ctxTextStage =
  (file: string, gen: (ctx: ImportContext) => Promise<string>): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, `src/data/${file}.h`, await gen(ctx));
  };

export { ctxTextStage };
