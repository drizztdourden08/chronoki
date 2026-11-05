/* @layer bridge-wasm @kind logic */
import type { OptionGroupEntry } from '@drizztdourden08/brock-randomizer/renderer';
import { ctUiOptions } from '@chronoki/game-core';
import { PARTY_SECTION } from './party-tab.constants';

const partyGroupsOf = (custom: boolean): readonly OptionGroupEntry[] => [{
  id: 'party',
  label: PARTY_SECTION,
  options: ctUiOptions().filter((option) => option.key === 'partyMode' || (!custom && option.key === 'partySize')),
}];

export { partyGroupsOf };
