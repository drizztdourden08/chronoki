/* @layer renderer-lib @kind logic */
import { readJson } from '@drizztdourden08/brock-core';
import { inputProfilesFile } from '@app/profiles/storage/input-profiles-file';
import { parseInputProfilesState } from './parse-input-profiles-state';
import { platformFiles } from './platform-files';
import type { InputProfilesState } from './input-profiles-state.type';

const readInputProfilesState = async (profileId: string): Promise<InputProfilesState> =>
  parseInputProfilesState(await readJson<unknown>(platformFiles(), inputProfilesFile(profileId), null));

export { readInputProfilesState };
