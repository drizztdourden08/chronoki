/* @layer bridge-wasm @kind constants */
const BUCKET_SCENE = 0x1d0;
const BUCKET_ANCHOR: readonly number[] = [0x18, 0x4d, 0x18];
const OP_IF_FLAG = 0x16;
const FLAG_PAGE_ONE = 0x80;
const IF_FLAG_BYTES = 5;
const ANCHOR_JUMP_AT = 2;
const ANCHOR_JUMP_BASE = 2;
const GATE_JUMP_BASE = 4;

export { ANCHOR_JUMP_AT, ANCHOR_JUMP_BASE, BUCKET_ANCHOR, BUCKET_SCENE, FLAG_PAGE_ONE, GATE_JUMP_BASE, IF_FLAG_BYTES, OP_IF_FLAG };
