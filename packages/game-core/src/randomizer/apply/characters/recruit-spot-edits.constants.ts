/* @layer bridge-wasm @kind constants */
import type { CtCharacter } from '../../world/ct-world-keys.type';

const RECRUIT_SPOT_SCENES: Readonly<Partial<Record<CtCharacter, readonly number[]>>> = {
  marle: [0x1b7, 0x07a],
  lucca: [0x005, 0x01e],
  frog: [0x081, 0x08d],
  robo: [0x0e2],
  ayla: [0x111, 0x113, 0x127],
};

const CHARACTER_IDS: Readonly<Record<CtCharacter, number>> = {
  crono: 0, marle: 1, lucca: 2, robo: 3, frog: 4, ayla: 5, magus: 6,
};

const FIXED_LOADER_OPS: Readonly<Record<CtCharacter, number>> = {
  crono: 0x57, marle: 0x5c, lucca: 0x62, robo: 0x6a, frog: 0x68, ayla: 0x6c, magus: 0x6d,
};

const OP_PARTY_LOADER = 0x80;
const OP_NPC_LOADER = 0x81;
const OP_RESERVE_ADD = 0xd0;
const OP_IF_ACTIVE = 0xd2;
const OP_JOIN = 0xd3;

const OPERAND_OPS: readonly number[] = [OP_PARTY_LOADER, OP_NPC_LOADER, OP_RESERVE_ADD, OP_IF_ACTIVE, OP_JOIN];
const ANCHOR_OPS: readonly number[] = [OP_RESERVE_ADD, OP_JOIN, OP_NPC_LOADER];

export { ANCHOR_OPS, CHARACTER_IDS, FIXED_LOADER_OPS, OPERAND_OPS, RECRUIT_SPOT_SCENES };
