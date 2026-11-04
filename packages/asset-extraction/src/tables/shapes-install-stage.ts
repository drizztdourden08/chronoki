/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/work-files';

const shapesInstallStage: StageRun = async (ctx) => {
  if (ctx.kit?.shapes === undefined) throw new Error('the Belthasar kit shapes are needed');
  let installed = 0;
  for (const [rel, text] of Object.entries(ctx.kit.shapes)) {
    const dst = `src/${rel}`;
    if (await ctx.work.exists(dst)) continue;
    await writeText(ctx.work, dst, text);
    installed += 1;
  }
  ctx.log(`shapes: ${installed} installed`);
};

export { shapesInstallStage };
