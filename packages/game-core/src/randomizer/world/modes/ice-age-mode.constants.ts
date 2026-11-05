/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import { CT_KEY_ITEMS } from '../ct-key-items.constants';
import type { CtModeDef } from './ct-mode-def.type';
import { STANDARD_MODE } from './standard-mode.constants';

const { all, has, region } = CT_KIT;

const ICE_AGE_MODE: CtModeDef = {
  ...STANDARD_MODE,
  id: 'ice-age',
  label: 'Ice Age',
  keyItems: CT_KEY_ITEMS.filter((item) => item !== 'ruby-knife'),
  removedExits: [
    { from: 'end-of-time', to: 'dark-ages' },
    { from: 'magus-castle', to: 'dark-ages' },
  ],
  removedRegions: ['ocean-palace', 'magus-castle'],
  extraEvents: [
    {
      id: 'beat-giga-gaia',
      region: 'dark-ages',
      rule: all(has('ayla'), has('dreamstone'), region('tyrano-lair')),
    },
  ],
  startFlags: [{ at: 0x7f00a6, bits: 0x04 }],
  goal: 'ice-age-woe',
  goalEvent: 'beat-giga-gaia',
  excludeDroppedTreasure: true,
  implemented: true,
};

export { ICE_AGE_MODE };
