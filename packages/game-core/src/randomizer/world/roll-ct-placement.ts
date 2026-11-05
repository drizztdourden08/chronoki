/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';
import { resolveStartParty } from './party/resolve-start-party';

const rollCtPlacement = (input: CtWorldInput, seed: string): CtPlacement => {
  const options = input.options ?? {};
  const startParty = fitStartParty(input.startParty ?? resolveStartParty(options, seed), options);
  return { ...generate(createCtWorldGame({ ...input, startParty, fillerSeed: seed }), { seed }), startParty };
};

export { rollCtPlacement };
