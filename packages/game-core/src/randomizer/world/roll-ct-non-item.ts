/* @layer bridge-wasm @kind logic */
import { bossAssignmentOf } from '../apply/boss-rando/boss-assignment-of';
import { elementAssignmentOf } from '../apply/element-rando/element-assignment-of';
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { objectiveRowsOf } from './bucket/objective-rows-of';
import type { CtNonItemRolls } from './ct-non-item-rolls.type';
import type { CtWorldInput } from './ct-world-input.type';
import { resolveMysteryOptions } from './mystery/resolve-mystery-options';
import { resolveStartParty } from './party/resolve-start-party';
import { characterAssignmentOf } from './recruits/character-assignment-of';

const rollCtNonItem = (rawInput: CtWorldInput, seed: string): CtNonItemRolls => {
  const options = resolveMysteryOptions(rawInput.options ?? {}, seed);
  const startParty = fitStartParty(rawInput.startParty ?? resolveStartParty(options, seed), options);
  const bosses = bossAssignmentOf(options, seed);
  const characters = characterAssignmentOf(options, seed);
  const elements = elementAssignmentOf(options, seed);
  const objectives = objectiveRowsOf(options, seed, startParty);
  const input: CtWorldInput = {
    ...rawInput, options, startParty, fillerSeed: seed, ...(characters === undefined ? {} : { characters }),
  };
  return { options, input, startParty, bosses, characters, elements, objectives };
};

export { rollCtNonItem };
