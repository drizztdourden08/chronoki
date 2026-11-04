/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/write-text';

/** The files a generator writes: name under the workdir's src/data/ -> text. */
type GenFiles = Record<string, string>;

/** A generator that reads the ROM and the oracle's states and writes headers into the workdir's src/data/. */
const oracleGenStage =
  (gen: (ctx: ImportContext) => Promise<GenFiles>): StageRun =>
  async (ctx) => {
    for (const [file, text] of Object.entries(await gen(ctx))) await writeText(ctx.work, `src/data/${file}`, text);
  };

export type { GenFiles };
export { oracleGenStage };
