/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { bossAssignmentOf } from '../apply/boss-rando/boss-assignment-of';
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { objectiveRowsOf } from './bucket/objective-rows-of';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';
import { resolveStartParty } from './party/resolve-start-party';

const rollCtPlacement = (input: CtWorldInput, seed: string): CtPlacement => {
  const options = input.options ?? {};
  const startParty = fitStartParty(input.startParty ?? resolveStartParty(options, seed), options);
  const bosses = bossAssignmentOf(options, seed);
  const objectives = objectiveRowsOf(options, seed, startParty);
  return {
    ...generate(createCtWorldGame({ ...input, startParty, fillerSeed: seed }), { seed }),
    startParty,
    ...(bosses === undefined ? {} : { bosses }),
    ...(objectives === undefined ? {} : { objectives }),
  };
};

export { rollCtPlacement };
