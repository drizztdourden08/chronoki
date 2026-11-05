/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { bossAssignmentOf } from '../apply/boss-rando/boss-assignment-of';
import { elementAssignmentOf } from '../apply/element-rando/element-assignment-of';
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';
import { resolveStartParty } from './party/resolve-start-party';
import { characterAssignmentOf } from './recruits/character-assignment-of';

const rollCtPlacement = (input: CtWorldInput, seed: string): CtPlacement => {
  const options = input.options ?? {};
  const startParty = fitStartParty(input.startParty ?? resolveStartParty(options, seed), options);
  const bosses = bossAssignmentOf(options, seed);
  const characters = characterAssignmentOf(options, seed);
  const elements = elementAssignmentOf(options, seed);
  const game = createCtWorldGame({ ...input, startParty, fillerSeed: seed, ...(characters === undefined ? {} : { characters }) });
  return {
    ...generate(game, { seed }),
    startParty,
    ...(bosses === undefined ? {} : { bosses }),
    ...(characters === undefined ? {} : { characters }),
    ...(elements === undefined ? {} : { elements }),
  };
};

export { rollCtPlacement };
