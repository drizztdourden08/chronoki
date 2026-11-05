/* @layer bridge-wasm @kind constants */
const INTRO_WORLD = 0x1f0;
const INTRO_JUMP = Uint8Array.of(0xe0, 0xf0, 0x81, 0x3f, 0x38);

const START_BLOCK_MAX_BYTES = 103;

export { INTRO_JUMP, INTRO_WORLD, START_BLOCK_MAX_BYTES };
