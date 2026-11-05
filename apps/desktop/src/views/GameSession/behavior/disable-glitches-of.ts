/* @layer renderer-appshell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';

const disableGlitchesOf = (profile: Profile | null): boolean => {
  const randomizer = profile?.randomizer;
  return randomizer !== undefined && randomizer.options.disableGlitches === true;
};

export { disableGlitchesOf };
