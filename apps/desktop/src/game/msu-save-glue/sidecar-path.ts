/* @layer bridge-wasm @kind logic */
import { saveSlotPaths } from '@drizztdourden08/brock-port-kit';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { SAVE_EXTENSION_PATTERN, SIDECAR_SUFFIX } from './msu-save-glue.constants';

const sidecarPath = (profileId: string, ref: SaveSlotRef): string =>
  saveSlotPaths(profileId, ref).state.replace(SAVE_EXTENSION_PATTERN, SIDECAR_SUFFIX);

export { sidecarPath };
