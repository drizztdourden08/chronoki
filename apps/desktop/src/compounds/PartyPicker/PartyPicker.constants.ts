/* @layer renderer-components @kind constants */
import type { CtCharacter } from '@chronoki/game-core';

const PARTY_PICKER_LABELS = {
  hint: 'Pick 1 to 7 in order. The first three are in the active party, the rest wait in reserve. Their recruit scenes are skipped. Starters keep their default names.',
  clear: 'Clear',
} as const;

const PARTY_CHARACTER_NAMES: Readonly<Record<CtCharacter, string>> = {
  crono: 'Crono', marle: 'Marle', lucca: 'Lucca', robo: 'Robo', frog: 'Frog', ayla: 'Ayla', magus: 'Magus',
};

export { PARTY_CHARACTER_NAMES, PARTY_PICKER_LABELS };
