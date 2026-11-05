/* @layer renderer-appshell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';

const disableGlitchesOf = (profile: Profile | null): boolean => {
  return profile?.randomizer?.options.disableGlitches === true;
};

export { disableGlitchesOf };
