/* @layer bridge-wasm @kind constants */
import type { CtCharacter } from '../ct-world-keys.type';

const CHARACTER_RANDO_STREAM = ':characters';
const CHARACTER_DUPLICATE_STREAM = ':characters-dup';
const CHARACTER_KINDS: readonly CtCharacter[] = ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla', 'magus'];
const CHARACTER_RANDO_SPOTS: readonly CtCharacter[] = ['marle', 'lucca', 'frog', 'robo', 'ayla'];
const CHARACTER_FIXED_SLOTS: readonly CtCharacter[] = ['crono', 'magus'];

export { CHARACTER_DUPLICATE_STREAM, CHARACTER_FIXED_SLOTS, CHARACTER_KINDS, CHARACTER_RANDO_SPOTS, CHARACTER_RANDO_STREAM };
