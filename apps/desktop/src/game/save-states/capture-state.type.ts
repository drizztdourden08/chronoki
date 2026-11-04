/* @layer bridge-wasm @kind types */
import type { StateFailure } from './save-state.type';

type Captured = { ok: true; bytes: Uint8Array } | { ok: false; reason: StateFailure };

export type { Captured };
