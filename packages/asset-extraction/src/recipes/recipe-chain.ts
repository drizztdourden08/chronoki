/* @layer shared-asset-extraction @kind logic */
import type { Recipe, RecipeSet } from './recipe.type';

/** recipes.py chain(): the recipes from the root to `name`. */
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

/** recipes.py deps_of(): the recipes `name` needs built first, its parent and the recipes its `sram` steps boot from. */
const depsOf = (recipes: RecipeSet, name: string): string[] => {
  const r = recipes.get(name);
  if (!r) throw new Error(`recipes: no recipe ${name}`);
  const sram = r.steps.flatMap((s) => (s.op === 'sram' ? [s.recipe] : []));
  return [...(r.from ? [r.from] : []), ...sram];
};

/** The names to build for `names`: each and every recipe under them (make_many's `need`). */
const closureOf = (recipes: RecipeSet, names: string[]): Set<string> => {
  const need = new Set<string>();
  const todo = [...names];
  while (todo.length > 0) {
    const n = todo.pop() as string;
    if (!need.has(n)) {
      need.add(n);
      todo.push(...depsOf(recipes, n));
    }
  }
  return need;
};

export { chainOf, closureOf, depsOf };
