/* @layer bridge-wasm @kind type */
type SpliceScope = { object: number; fn: number; first?: boolean };

type ScriptSplice = {
  scene: number;
  scope?: SpliceScope;
  anchor: (op: Uint8Array) => boolean;
  replace: Uint8Array;
  why: string;
};

type SpliceResult = { ok: true; bytes: Uint8Array } | { ok: false; failed: string[] };

type BlobResult = { ok: true; raw: Uint8Array } | { ok: false; failed: string[] };

type EncodeResult = { ok: true; bytes: Uint8Array } | { ok: false; failed: string[] };

type ScriptOp ={ at: number; length: number };

type SpliceShift = { at: number; end: number; delta: number };

type JumpSpec = { dispAt: number; back: boolean };

export type { BlobResult, EncodeResult, JumpSpec, ScriptOp, ScriptSplice, SpliceResult, SpliceScope, SpliceShift };
