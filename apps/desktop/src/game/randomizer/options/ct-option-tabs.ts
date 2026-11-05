/* @layer bridge-wasm @kind logic */
import { defaultOptionTabs } from '@drizztdourden08/brock-randomizer/renderer';
import type { OptionTab } from '@drizztdourden08/brock-randomizer';
import { ctUiOptions } from '@chronoki/game-core';
import { PartyTab } from './PartyTab';
import { PARTY_SECTION } from './party-tab.constants';

const ctOptionTabs = (): readonly OptionTab[] => [
  ...defaultOptionTabs(ctUiOptions().filter((option) => option.section !== PARTY_SECTION)),
  { id: 'party', label: PARTY_SECTION, Body: PartyTab },
];

export { ctOptionTabs };
