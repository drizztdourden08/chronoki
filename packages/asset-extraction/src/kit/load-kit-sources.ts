/* @layer shared-asset-extraction @kind logic */
import { join } from 'node:path';
import type { KitSources } from '../pipeline/import-context.type';
import { findToolsDir } from './find-tools-dir';
import { MANIFEST_FILE, MANIFEST_FOLDER, RECIPE_FILE, RECIPES_FOLDER, SHAPES_FOLDER } from './kit-paths.constants';
import { readFolderTexts } from './read-folder-texts';
import { readShapes } from './read-shapes';

const loadKitSources = async (belthasarToolsDir: string): Promise<KitSources> => {
  const tools = await findToolsDir(belthasarToolsDir);
  const recipes = await readFolderTexts(join(tools, RECIPES_FOLDER), RECIPE_FILE);
  return {
    recipeTexts: recipes.map((r) => r.text),
    manifests: await readFolderTexts(join(tools, MANIFEST_FOLDER), MANIFEST_FILE),
    shapes: await readShapes(join(tools, SHAPES_FOLDER)),
  };
};

export { loadKitSources };
