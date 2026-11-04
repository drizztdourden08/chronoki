/* @layer renderer-lib @kind logic */
import { writeJson } from '@drizztdourden08/brock-core';
import { inputProfilesFile } from '@app/profiles/storage/input-profiles-file';
import { platformFiles } from './platform-files';
import type { InputProfilesState } from './input-profiles-state.type';

const writeInputProfilesState = (profileId: string, state: InputProfilesState): Promise<void> =>
  writeJson(platformFiles(), inputProfilesFile(profileId), state);

export { writeInputProfilesState };
