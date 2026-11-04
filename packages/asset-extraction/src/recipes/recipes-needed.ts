/* @layer shared-asset-extraction @kind logic */
import type { Generator } from './manifest.type';

const recipesNeeded = (gens: Generator[]): string[] => [...new Set(gens.flatMap((g) => g.recipes ?? []))].sort();

export { recipesNeeded };
