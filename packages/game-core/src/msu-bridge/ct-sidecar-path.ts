/* @layer bridge-wasm @kind logic */
import { saveSlotPaths } from '@drizztdourden08/brock-port-kit';
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import { CT_MSU_RESUME_SUFFIX, CT_SAVE_EXTENSION_PATTERN } from './ct-msu-config.constants';

const ctSidecarPath = (profileId: string, ref: SaveSlotRef): string =>
  saveSlotPaths(profileId, ref).state.replace(CT_SAVE_EXTENSION_PATTERN, CT_MSU_RESUME_SUFFIX);

export { ctSidecarPath };
