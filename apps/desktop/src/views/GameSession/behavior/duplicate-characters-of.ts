/* @layer renderer-appshell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';

const duplicateCharactersOf = (profile: Profile | null): boolean => {
  const options = profile?.randomizer?.options;
  return options?.characterRando === true && options.duplicateCharacters === true;
};

export { duplicateCharactersOf };
