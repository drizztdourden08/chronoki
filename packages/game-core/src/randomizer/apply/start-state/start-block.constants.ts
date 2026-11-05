/* @layer bridge-wasm @kind constants */
const INTRO_WORLD = 0x1f0;
const INTRO_JUMP = Uint8Array.of(0xe0, 0xf0, 0x81, 0x3f, 0x38);

// A scene-0 jump has a 1-byte displacement, so the start block may only grow a little.
// Measured on the real data: the pre-party block was 83 bytes; +20 (103) fits, +30 (113) is refused.
// With the standard start (79 bytes once its adjacent pokes are merged) that leaves 24 bytes for the party:
// the joined-mask poke (5) plus roster pokes (a changed byte costs 5, two consecutive changed bytes cost 6).
// Crono first always fits (7 characters: 6 roster slots = 18, plus the mask). A 7-character party
// with Crono in a later slot changes 7 slots (23 + 5) and is refused by planStartState.
const START_BLOCK_MAX_BYTES = 103;

export { INTRO_JUMP, INTRO_WORLD, START_BLOCK_MAX_BYTES };
