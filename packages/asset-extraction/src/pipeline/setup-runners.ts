/* @layer shared-asset-extraction @kind logic */
import { orderedGenerators, recipesNeeded } from '../recipes/manifest';
import { loadRecipes } from '../recipes/load-recipes';
import { createRecipeMaker } from '../recipes/recipe-maker';
import { CT_ROM_NAME, CT_ROM_SHA1, ROM_WORK_PATH } from '../rom/rom.constants';
import { loadRom } from '../rom/load-rom';
import { sha1Hex } from '../rom/sha1';
import { mergeTablesInto } from '../ctas/table-container';
import type { StageRun } from './stage.type';
import { requireBytes } from './work-files';

const ASSETS_PATH = 'build/ct_assets.dat';
const TABLES_PATH = 'build/ct_tables.dat';

/** setup.py: load the ROM (header stripped, SHA-1 checked), keep the verified copy in the workdir. */
const verifyRomStage: StageRun = async (ctx) => {
  ctx.rom = loadRom(ctx.rom);
  await ctx.work.writeBytes(ROM_WORK_PATH, ctx.rom);
  ctx.log(`ROM verified: ${CT_ROM_NAME}, SHA-1 ${CT_ROM_SHA1}`);
};

/** setup.py: start the oracle on the verified ROM. */
const oracleStage: StageRun = async (ctx) => {
  if (ctx.oracle === null) throw new Error('no oracle is available');
  await ctx.oracle.boot(ctx.rom);
};

/** setup.py: replay, side by side, every recipe the generators need (recipes.py make_many). */
const replayRecipesStage: StageRun = async (ctx) => {
  if (ctx.oracle === null || ctx.kit === null) throw new Error('the oracle and the Belthasar kit sources are needed');
  const recipes = loadRecipes(ctx.kit.recipeTexts);
  const names = recipesNeeded(orderedGenerators(ctx.kit.manifests));
  const maker = createRecipeMaker({
    recipes,
    oracle: ctx.oracle,
    work: ctx.work,
    romSha1: sha1Hex(ctx.rom),
    jobs: ctx.jobs,
    log: ctx.log,
  });
  await maker.makeMany(names);
};

/** setup.py: the container with the packed tables inside, written where the player's files go. */
const writePlayerAssetsStage: StageRun = async (ctx) => {
  const assets = await requireBytes(ctx.work, ASSETS_PATH);
  const pack = await requireBytes(ctx.work, TABLES_PATH);
  await ctx.work.writeBytes(`${ctx.outDir}/ct_assets.dat`, mergeTablesInto(assets, pack));
};

const SETUP_RUNNERS: Record<string, StageRun> = {
  'verify-rom': verifyRomStage,
  oracle: oracleStage,
  'replay-recipes': replayRecipesStage,
  'write-player-assets': writePlayerAssetsStage,
};

export { ASSETS_PATH, SETUP_RUNNERS, TABLES_PATH };
