/* @layer shared-asset-extraction @kind logic */
import type { RecipeSet } from './recipe.type';
import { depsOf } from './deps-of';

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

export { closureOf };
