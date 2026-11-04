/* @layer bridge-wasm @kind types */
import type { GateMode } from '@chronoki/design';

interface OpenSession {
  profileId: string;
  startedAt: number;
  mode: GateMode;
}

export type { OpenSession };
