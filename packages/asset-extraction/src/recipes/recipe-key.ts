/* @layer shared-asset-extraction @kind logic */
import { sha1Hex } from '../rom/sha1';
import { chainOf } from './recipe-chain';
import type { RecipeSet } from './recipe.type';

const encoder = new TextEncoder();

interface KeyInputs {
  recipes: RecipeSet;
  romSha1: string;
  oracleTag: string;
  fileHash: (path: string) => string;
}

const recipeKey = (inputs: KeyInputs, name: string): string => {
  const chain = chainOf(inputs.recipes, name);
  const body: unknown[] = chain.map((r) => [r.name, r.keyBody]);
  for (const r of chain) {
    for (const step of r.steps) {
      if (step.op === 'sram') body.push(['sram', recipeKey(inputs, step.recipe)]);
      else if (step.op === 'sram_file') body.push(['sram_file', inputs.fileHash(step.path)]);
    }
  }
  return sha1Hex(encoder.encode(JSON.stringify([body, inputs.romSha1, inputs.oracleTag])));
};

export { recipeKey };
export type { KeyInputs };
