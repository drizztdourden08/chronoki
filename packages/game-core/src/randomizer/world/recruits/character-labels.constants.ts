/* @layer bridge-wasm @kind constants */
import type { CtCharacter } from '../ct-world-keys.type';

const CHARACTER_LABELS: Readonly<Record<CtCharacter, string>> = {
  crono: 'Crono', marle: 'Marle', lucca: 'Lucca', robo: 'Robo', frog: 'Frog', ayla: 'Ayla', magus: 'Magus',
};

export { CHARACTER_LABELS };
