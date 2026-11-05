/* @layer bridge-wasm @kind constants */
import type { CtCharacter } from '../ct-world-keys.type';

const CT_CHARACTERS: readonly CtCharacter[] = ['crono', 'marle', 'lucca', 'robo', 'frog', 'ayla', 'magus'];

const CT_RANDOM_POOL: readonly CtCharacter[] = CT_CHARACTERS;

const PARTY_STREAM = ':party';

const PARTY_MIN_SIZE = 1;

const PARTY_MAX_SIZE = 7;

export { CT_CHARACTERS, CT_RANDOM_POOL, PARTY_MAX_SIZE, PARTY_MIN_SIZE, PARTY_STREAM };
