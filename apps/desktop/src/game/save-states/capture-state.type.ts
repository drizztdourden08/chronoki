/* @layer bridge-wasm @kind types */
import type { StateFailure } from './save-state.type';

type Captured = { ok: true; bytes: Uint8Array } | { ok: false; reason: StateFailure };

type EngineCaptured = { ok: true; state: Uint8Array } | { ok: false; reason: StateFailure };

export type { Captured, EngineCaptured };
