/* @layer renderer-components @kind constants */
import type { CtCharacter } from '@chronoki/game-core';

const PARTY_PICKER_LABELS = {
  hint: 'Pick 1 to 7 in order. The first three are in the active party, the rest wait in reserve.',
  clear: 'Clear',
  active: 'Active',
  reserve: 'Reserve',
  lead: 'lead',
  note: 'Their recruit scenes are skipped. Starters keep their default names.',
} as const;

const PARTY_CHARACTER_NAMES: Readonly<Record<CtCharacter, string>> = {
  crono: 'Crono', marle: 'Marle', lucca: 'Lucca', robo: 'Robo', frog: 'Frog', ayla: 'Ayla', magus: 'Magus',
};

const PARTY_ACTIVE_SLOTS = 3;

export { PARTY_ACTIVE_SLOTS, PARTY_CHARACTER_NAMES, PARTY_PICKER_LABELS };
