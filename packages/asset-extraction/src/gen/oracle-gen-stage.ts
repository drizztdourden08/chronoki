/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/work-files';
import type { GenFiles } from './oracle-gen-stage.type';

const oracleGenStage =
  (gen: (ctx: ImportContext) => Promise<GenFiles>): StageRun =>
  async (ctx) => {
    for (const [file, text] of Object.entries(await gen(ctx))) await writeText(ctx.work, `src/data/${file}`, text);
  };
export { oracleGenStage };
