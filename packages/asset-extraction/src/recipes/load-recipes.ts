/* @layer shared-asset-extraction @kind logic */
import { parseRecipe } from './parse-recipe';
import type { RecipeSet } from './recipe.type';

/**
 * recipes.py load_all(): every recipe JSON text (one per file of tools/recipes/, read by import-core from
 * core/belthasar/) into a set by name. A name defined twice is an error. The recipes are Belthasar's, fetched at
 * import time and never copied into this repository.
 */
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
