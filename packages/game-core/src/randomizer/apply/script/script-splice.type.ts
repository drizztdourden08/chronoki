/* @layer bridge-wasm @kind type */
type ScriptSplice = {
  scene: number;
  anchor: (op: Uint8Array) => boolean;
  replace: Uint8Array;
  why: string;
};

type SpliceResult = { ok: true; bytes: Uint8Array } | { ok: false; failed: string[] };

type BlobResult = { ok: true; raw: Uint8Array } | { ok: false; failed: string[] };

type ScriptOp = { at: number; length: number };

type SpliceShift = { at: number; end: number; delta: number };

type JumpSpec = { dispAt: number; back: boolean };

export type { BlobResult, JumpSpec, ScriptOp, ScriptSplice, SpliceResult, SpliceShift };
