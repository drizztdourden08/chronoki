/* @layer shared-asset-extraction @kind logic */
import type { RecipeSet } from './recipe.type';

const depsOf = (recipes: RecipeSet, name: string): string[] => {
  const r = recipes.get(name);
  if (!r) throw new Error(`recipes: no recipe ${name}`);
  const sram = r.steps.flatMap((s) => (s.op === 'sram' ? [s.recipe] : []));
  return [...(r.from ? [r.from] : []), ...sram];
};

export { depsOf };
