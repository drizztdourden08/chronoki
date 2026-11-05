/* @layer bridge-wasm @kind constants */
import { CT_KEY_ITEMS } from '../ct-key-items.constants';
import type { CtEra } from '../ct-world-keys.type';
import type { CtModeDef, CtModeId } from './ct-mode-def.type';

const CT_ALL_ERAS: readonly CtEra[] = ['present', 'middle-ages', 'future', 'prehistory', 'dark-ages', 'end-of-time', 'none'];

const STANDARD_MODE: CtModeDef = {
  id: 'standard',
  label: 'Standard',
  implemented: true,
  start: 'present',
  eras: CT_ALL_ERAS,
  extraExits: [],
  rulePatches: {},
  keyItems: CT_KEY_ITEMS,
  goal: 'beat-lavos',
  startState: 'jot-standard',
};

const stubOf = (id: CtModeId, label: string, overrides: Partial<CtModeDef> = {}): CtModeDef =>
  ({ ...STANDARD_MODE, id, label, implemented: false, ...overrides });

const CT_MODES: readonly CtModeDef[] = [
  STANDARD_MODE,
  stubOf('lost-worlds', 'Lost Worlds', { start: 'end-of-time', startState: 'jot-lost-worlds' }),
  stubOf('legacy-of-cyrus', 'Legacy of Cyrus', { goal: 'beat-ozzie' }),
  stubOf('ice-age', 'Ice Age', { goal: 'ice-age-woe' }),
  stubOf('vanilla-rando', 'Vanilla Rando'),
];

const CT_DEFAULT_MODE: CtModeId = 'standard';

export { CT_ALL_ERAS, CT_DEFAULT_MODE, CT_MODES };
