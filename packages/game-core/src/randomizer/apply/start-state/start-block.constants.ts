/* @layer bridge-wasm @kind constants */
const INTRO_WORLD = 0x1f0;
const INTRO_JUMP = Uint8Array.of(0xe0, 0xf0, 0x81, 0x3f, 0x38);

// The block is spliced at the intro jump (offset 226); the earlier 0x16 jump at offset 77 has displacement 152
// and must still reach offset 233: 152 + (blockLength - 5) <= 255, so blockLength <= 108.
const START_BLOCK_MAX_BYTES = 108;

export { INTRO_JUMP, INTRO_WORLD, START_BLOCK_MAX_BYTES };
