/* @layer shared-asset-extraction @kind logic */
import { parseRecipe } from './parse-recipe';
import type { RecipeSet } from './recipe.type';

const loadRecipes = (texts: Iterable<string>): RecipeSet => {
  const out: RecipeSet = new Map();
  for (const text of texts) {
    const r = parseRecipe(text);
    if (out.has(r.name)) throw new Error(`recipes: ${r.name} is defined twice`);
    out.set(r.name, r);
  }
  return out;
};

export { loadRecipes };
