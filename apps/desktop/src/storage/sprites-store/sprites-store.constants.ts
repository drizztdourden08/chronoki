/* @layer renderer-lib @kind constants */
const PARTY_SPRITE_SUBDIR = 'party';

const PARTY_CHARACTER_COUNT = 7;

const PARTY_SPRITE_NAMES: readonly string[] = Array.from({ length: PARTY_CHARACTER_COUNT }, (_, id) => [`portrait-${id}.png`, `stand-${id}.png`]).flat();

export { PARTY_CHARACTER_COUNT, PARTY_SPRITE_NAMES, PARTY_SPRITE_SUBDIR };
