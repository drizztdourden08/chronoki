/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';
import { duplicateFlagOf } from './duplicate-flag-of';
import { rollMysteryOptions } from './mystery/roll-mystery-options';
import { rollCtNonItem } from './roll-ct-non-item';

const rollCtPlacement = (rawInput: CtWorldInput, seed: string): CtPlacement => {
  const { options, input, startParty, bosses, characters, elements, objectives } = rollCtNonItem(rawInput, seed);
  return {
    ...generate(createCtWorldGame(input), { seed }),
    startParty,
    ...(bosses === undefined ? {} : { bosses }),
    ...(characters === undefined ? {} : { characters }),
    ...duplicateFlagOf(options, characters),
    ...(elements === undefined ? {} : { elements }),
    ...(objectives === undefined ? {} : { objectives }),
    ...(options.mysterySeed === true ? { mystery: rollMysteryOptions(seed) } : {}),
  };
};

export { rollCtPlacement };
