/* @layer shared-asset-extraction @kind logic */
import { orderedGenerators, recipesNeeded } from '../recipes/manifest';
import { loadRecipes } from '../recipes/load-recipes';
import { createRecipeMaker } from '../recipes/recipe-maker';
import { sha1Hex } from '../rom/sha1';
import type { StageRun } from './stage.type';

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

export { replayRecipesStage };
