/* @layer renderer-app @kind logic */
import { frozenKeysOf } from '@drizztdourden08/brock-randomizer';
import { useProfilesStore } from '@drizztdourden08/brock-react';

const isRandomizerFrozen = (key: string): boolean =>
  frozenKeysOf(useProfilesStore.getState().active?.randomizer).includes(key);

export { isRandomizerFrozen };
