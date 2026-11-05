/* @layer bridge-wasm @kind constants */
import { CT_KEY_ITEMS } from '../ct-key-items.constants';
import type { CtEra } from '../ct-world-keys.type';
import type { CtModeDef } from './ct-mode-def.type';

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

export { CT_ALL_ERAS, STANDARD_MODE };
