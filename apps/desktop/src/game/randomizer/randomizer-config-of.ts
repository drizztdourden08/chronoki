/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import { useProfilesStore } from '@drizztdourden08/brock-react';

const randomizerConfigOf = (profileId: string): RandomizerProfileConfig | undefined =>
  useProfilesStore.getState().profiles.find((profile) => profile.id === profileId)?.randomizer;

export { randomizerConfigOf };
