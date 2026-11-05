/* @layer bridge-wasm @kind constants */
import { createRng } from '@drizztdourden08/brock-randomizer/world';
import { CT_RANDOM_POOL, PARTY_STREAM } from './ct-party.constants';
import type { CtPartyMode, CtPartySource } from './ct-party.type';
import { parseStartParty } from './parse-start-party';
import { partySizeOf } from './party-size-of';

const CT_PARTY_SOURCES: Readonly<Record<CtPartyMode, CtPartySource>> = {
  random: {
    resolve: (options, seed) =>
      createRng(`${seed}${PARTY_STREAM}`).shuffle(CT_RANDOM_POOL).slice(0, partySizeOf(options.partySize)),
  },
  custom: { resolve: (options) => parseStartParty(options.startingParty) },
};

export { CT_PARTY_SOURCES };
