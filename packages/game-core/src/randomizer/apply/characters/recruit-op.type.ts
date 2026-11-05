/* @layer bridge-wasm @kind type */
type RecruitOp = { at: number; kind: 'operand' | 'opcode'; old: number; object: number };

export type { RecruitOp };
