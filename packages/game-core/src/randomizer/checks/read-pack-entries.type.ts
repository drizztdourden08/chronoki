/* @layer bridge-wasm @kind type */
type PackEntry = { type: number; id: number; start: number; length: number };
type GiftOperand = { patchAt: number; item: number };

export type { GiftOperand, PackEntry };
