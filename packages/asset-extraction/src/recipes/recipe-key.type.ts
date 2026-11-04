/* @layer shared-asset-extraction @kind types */
import type { RecipeSet } from './recipe.type';

interface KeyInputs {
  recipes: RecipeSet;
  romSha1: string;
  oracleTag: string;
  fileHash: (path: string) => string;
}

export type { KeyInputs };
