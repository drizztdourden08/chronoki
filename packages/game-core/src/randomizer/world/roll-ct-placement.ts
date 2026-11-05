/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { bossAssignmentOf } from '../apply/boss-rando/boss-assignment-of';
import { elementAssignmentOf } from '../apply/element-rando/element-assignment-of';
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { objectiveRowsOf } from './bucket/objective-rows-of';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';
import { resolveMysteryOptions } from './mystery/resolve-mystery-options';
import { rollMysteryOptions } from './mystery/roll-mystery-options';
import { resolveStartParty } from './party/resolve-start-party';
import { characterAssignmentOf } from './recruits/character-assignment-of';

const rollCtPlacement = (rawInput: CtWorldInput, seed: string): CtPlacement => {
  const options = resolveMysteryOptions(rawInput.options ?? {}, seed);
  const input = { ...rawInput, options };
  const startParty = fitStartParty(input.startParty ?? resolveStartParty(options, seed), options);
  const bosses = bossAssignmentOf(options, seed);
  const characters = characterAssignmentOf(options, seed);
  const elements = elementAssignmentOf(options, seed);
  const objectives = objectiveRowsOf(options, seed, startParty);
  const game = createCtWorldGame({ ...input, startParty, fillerSeed: seed, ...(characters === undefined ? {} : { characters }) });
  return {
    ...generate(game, { seed }),
    startParty,
    ...(bosses === undefined ? {} : { bosses }),
    ...(characters === undefined ? {} : { characters }),
    ...(elements === undefined ? {} : { elements }),
    ...(objectives === undefined ? {} : { objectives }),
    ...(options.mysterySeed === true ? { mystery: rollMysteryOptions(seed) } : {}),
  };
};

export { rollCtPlacement };
