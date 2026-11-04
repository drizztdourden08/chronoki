/* @layer shared-asset-extraction @kind logic */
import { sha1Hex } from '../rom/sha1';
import { chainOf } from './recipe-chain';
import type { RecipeSet } from './recipe.type';

const encoder = new TextEncoder();

interface KeyInputs {
  recipes: RecipeSet;
  romSha1: string;
  /** Identifies the oracle build (recipes.py oracle_tag hashed the oracle's sources); a new oracle rebuilds every state. */
  oracleTag: string;
  /** The SHA-256/SHA-1 of a third-party battery save, for `sram_file` steps. */
  fileHash: (path: string) => string;
}

/**
 * recipes.py key_of(): the cache key of a recipe is the whole chain's steps and expectations, the ROM and the oracle,
 * so a state is rebuilt only when one of them changes. (The key text is ChronoKi's own, not Python's json.dumps.)
 */
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
