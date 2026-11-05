/* @layer bridge-wasm @kind logic */
import { generate } from '@drizztdourden08/brock-randomizer/world';
import { bossAssignmentOf } from '../apply/boss-rando/boss-assignment-of';
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { createCtWorldGame } from './create-ct-world-game';
import type { CtPlacement } from './ct-placement.type';
import type { CtWorldInput } from './ct-world-input.type';
import { resolveMysteryOptions } from './mystery/resolve-mystery-options';
import { rollMysteryOptions } from './mystery/roll-mystery-options';
import { resolveStartParty } from './party/resolve-start-party';

const rollCtPlacement = (rawInput: CtWorldInput, seed: string): CtPlacement => {
  const options = resolveMysteryOptions(rawInput.options ?? {}, seed);
  const input = { ...rawInput, options };
  const startParty = fitStartParty(input.startParty ?? resolveStartParty(options, seed), options);
  const bosses = bossAssignmentOf(options, seed);
  return {
    ...generate(createCtWorldGame({ ...input, startParty, fillerSeed: seed }), { seed }),
    startParty,
    ...(bosses === undefined ? {} : { bosses }),
    ...(options.mysterySeed === true ? { mystery: rollMysteryOptions(seed) } : {}),
  };
};

export { rollCtPlacement };
