/* @layer bridge-wasm @kind constants */
const OBJECTS = 3;
const FUNCTIONS = 16;
const HEADER = OBJECTS * 32;
const OP_END = 0x00;
const OP_JOIN = 0xd3;
const OP_LEAVE = 0xd4;
const OP_IF_ACTIVE = 0xd2;
const OP_NPC_LOADER = 0x81;

export { FUNCTIONS, HEADER, OBJECTS, OP_END, OP_IF_ACTIVE, OP_JOIN, OP_LEAVE, OP_NPC_LOADER };
