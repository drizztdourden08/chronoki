/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtKeyItem } from '../ct-world-keys.type';
import { CT_KEY_ITEMS } from '../ct-key-items.constants';
import type { CtModeDef } from './ct-mode-def.type';
import { CT_ALL_ERAS, STANDARD_MODE } from './standard-mode.constants';

const { all, has, region } = CT_KIT;

const DROPPED_KEY_ITEMS: readonly CtKeyItem[] = ['c-trigger', 'clone', 'ruby-knife', 'moon-stone', 'jerky', 'robo-ribbon'];

const LEGACY_OF_CYRUS_MODE: CtModeDef = {
  ...STANDARD_MODE,
  id: 'legacy-of-cyrus',
  label: 'Legacy of Cyrus',
  eras: CT_ALL_ERAS.filter((era) => era !== 'future'),
  keyItems: CT_KEY_ITEMS.filter((item) => !DROPPED_KEY_ITEMS.includes(item)),
  removedExits: [
    { from: 'magus-castle', to: 'ocean-palace' },
    { from: 'tyrano-lair', to: 'ocean-palace' },
  ],
  extraEvents: [
    { id: 'magus', region: 'magus-castle' },
    { id: 'cyrus-done', region: 'northern-ruins', rule: all(has('frog'), has('hero-medal'), has('grand-leon')) },
    {
      id: 'beat-ozzie',
      region: 'ozzies-fort',
      rule: all(has('frog'), has('magus'), has('cyrus-done'), region('magus-castle')),
    },
  ],
  forcedOptions: { earlyPendantCharge: true },
  startFlags: [{ at: 0x7f019e, bits: 0x40 }],
  goal: 'beat-ozzie',
  goalEvent: 'beat-ozzie',
  excludeDroppedTreasure: true,
  requiredCharacters: ['frog'],
  implemented: true,
};

export { LEGACY_OF_CYRUS_MODE };
