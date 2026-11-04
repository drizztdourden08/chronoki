/* @layer shared-asset-extraction @kind logic */
import { createCtasBuilder } from '../ctas/ctas-builder';
import { ASSETS_PATH } from '../pipeline/setup-paths.constants';
import type { StageRun } from '../pipeline/stage.type';
import { buildPackTables } from './build-pack-tables';
import { PACKERS } from './packers';
import type { PackContext } from './extract.type';

/** setup.py "extracting the assets": assets/extract_assets.py build(), the 24 packers into ct_assets.dat (CTAS v3). */
const extractAssetsStage: StageRun = async (ctx) => {
  const pack: PackContext = {
    rom: ctx.rom,
    tables: buildPackTables(ctx.rom),
    work: ctx.work,
    abi: ctx.abi,
    log: ctx.log,
  };
  const ctas = createCtasBuilder();
  for (const packer of PACKERS) ctas.addAll(await packer(pack));
  await ctx.work.writeBytes(ASSETS_PATH, ctas.build());
  ctx.log(`ct_assets.dat: ${ctas.count()} entries`);
};

export { extractAssetsStage };
