/* @layer shared-asset-extraction @kind logic */
import type { Recipe, RecipeSet } from './recipe.type';
import { depsOf } from './deps-of';

const chainOf = (recipes: RecipeSet, name: string): Recipe[] => {
  const seq: Recipe[] = [];
  const seen = new Set<string>();
  let next: string | null = name;
  while (next) {
    if (seen.has(next)) throw new Error(`recipes: a cycle through ${next}`);
    const r = recipes.get(next);
    if (!r) throw new Error(`recipes: no recipe ${next}`);
    seen.add(next);
    seq.push(r);
    next = r.from;
  }
  return seq.reverse();
};

export { chainOf };
