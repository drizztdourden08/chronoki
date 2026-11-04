/* @layer bridge-wasm @kind type */
type PackEntry = { type: number; id: number; start: number; length: number };
type GiftOperand = { patchAt: number; item: number; object: number };
type GiftGroup = { object: number; item: number; patchAt: number[]; variant: number | null };

export type { GiftGroup, GiftOperand, PackEntry };
