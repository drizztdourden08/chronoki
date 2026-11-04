/* @layer bridge-wasm @kind logic */
import { ctMsuConfig } from '@chronoki/game-core';
import { sidecarPath } from './sidecar-path';
import { slotRefOf } from './slot-ref-of';

const sidecarConfig = {
  ...ctMsuConfig,
  resumePath: (profile: string, slotKind: string, slotId: string | number): string =>
    sidecarPath(profile, slotRefOf(slotKind, slotId)),
};

export { sidecarConfig };
