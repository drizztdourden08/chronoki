/* @layer bridge-wasm @kind constants */
import type { JumpSpec } from './script-splice.type';

const forward = (dispAt: number): JumpSpec => ({ dispAt, back: false });
const PAD_BRANCH_OPS: readonly number[] = [
  0x30, 0x31, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3b, 0x3c, 0x3f, 0x40, 0x41, 0x42, 0x43, 0x44,
];

const buildJumpSpecs = (): Readonly<Record<number, JumpSpec>> => {
  const specs: Record<number, JumpSpec> = {
    0x10: forward(1),
    0x11: { dispAt: 1, back: true },
    0x12: forward(4),
    0x13: forward(5),
    0x14: forward(4),
    0x15: forward(4),
    0x16: forward(4),
    0x18: forward(2),
    0x1a: forward(2),
    0x27: forward(2),
    0x28: forward(2),
    0x2d: forward(1),
    0xc9: forward(2),
    0xcc: forward(3),
    0xcf: forward(2),
    0xd2: forward(2),
  };
  PAD_BRANCH_OPS.forEach((op) => {
    specs[op] = forward(1);
  });
  return specs;
};

const JUMP_SPECS: Readonly<Record<number, JumpSpec>> = buildJumpSpecs();

export { JUMP_SPECS };
