/* @layer bridge-wasm @kind logic */
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { ctSidecarPath } from './ct-sidecar-path';

const ctSaveCompanions = (profileId: string, ref: SaveSlotRef): string[] => [ctSidecarPath(profileId, ref)];

export { ctSaveCompanions };
