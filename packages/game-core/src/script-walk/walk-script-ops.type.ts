/* @layer bridge-wasm @kind type */
type ScriptOpAt = { object: number; fn: number; at: number; op: number; length: number };
type FunctionStartAt = { from: number; object: number; fn: number };

export type { FunctionStartAt, ScriptOpAt };
