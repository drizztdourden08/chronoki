/* @layer shared-asset-extraction @kind logic */
import { mergeTablesInto } from '../ctas/table-container';
import type { StageRun } from './stage.type';
import { requireBytes } from './work-files';
import { ASSETS_PATH, TABLES_PATH } from './setup-paths.constants';

const writePlayerAssetsStage: StageRun = async (ctx) => {
  const assets = await requireBytes(ctx.work, ASSETS_PATH);
  const pack = await requireBytes(ctx.work, TABLES_PATH);
  await ctx.work.writeBytes(`${ctx.outDir}/ct_assets.dat`, mergeTablesInto(assets, pack));
};

export { writePlayerAssetsStage };
