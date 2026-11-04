/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/work-files';

/**
 * gen/shapes.py install: copy a shape into src/data or src/xlat for every generated file that is missing.
 * The shapes are Belthasar's own files (declarations and sizes, no game data), read by import-core into
 * `kit.shapes` keyed by their path under shapes/ ("data/menu_shop.h").
 */
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
