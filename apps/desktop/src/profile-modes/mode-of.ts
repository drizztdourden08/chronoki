/* @layer renderer-app @kind logic */
import { resolveProfileMode } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { MODE_OF_RANDOMIZER } from '@app/compounds/ModeBadge';
import type { ProfileModeId } from '@app/compounds/ModeBadge';
import { APP_PROFILE_MODES } from './profile-modes.constants';

const modeOf = (profile: Profile, settings: object | null | undefined): ProfileModeId => {
  const { randomizer } = profile;
  if (randomizer) return MODE_OF_RANDOMIZER[randomizer.mode];
  const config = (settings ?? null) as Record<string, unknown> | null;
  return (resolveProfileMode(APP_PROFILE_MODES, profile, config)?.id ?? 'vanilla') as ProfileModeId;
};

export { modeOf };
