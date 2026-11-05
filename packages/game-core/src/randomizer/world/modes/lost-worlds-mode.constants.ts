/* @layer bridge-wasm @kind constants */
import type { CtModeDef } from './ct-mode-def.type';
import { STANDARD_MODE } from './standard-mode.constants';

const LOST_WORLDS_MODE: CtModeDef = {
  ...STANDARD_MODE,
  id: 'lost-worlds',
  label: 'Lost Worlds',
  implemented: true,
  start: 'future',
  eras: ['future', 'prehistory', 'dark-ages', 'end-of-time', 'none'],
  extraExits: [
    { from: 'future', to: 'prehistory' },
    { from: 'prehistory', to: 'future' },
    { from: 'future', to: 'dark-ages' },
    { from: 'dark-ages', to: 'future' },
    { from: 'prehistory', to: 'dark-ages' },
  ],
  keyItems: ['c-trigger', 'clone', 'pendant', 'dreamstone', 'ruby-knife'],
  goal: 'beat-lavos',
  startState: 'jot-lost-worlds',
  excludeDroppedTreasure: true,
};

export { LOST_WORLDS_MODE };
