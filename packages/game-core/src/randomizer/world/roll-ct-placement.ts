/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';

const rollCtPlacement = (input: CtWorldInput, seed: string): CtPlacement =>
  generate(createCtWorldGame(input), { seed });

export { rollCtPlacement };
