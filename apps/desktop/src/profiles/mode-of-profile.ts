/* @layer renderer-app @kind logic */
import { MODE_OF_RANDOMIZER } from './profile-mode-labels.constants';
import type { ModeSource, ProfileModeId } from './profile-mode.type';

const modeOfProfile = (profile: ModeSource, vanillaSafe: boolean): ProfileModeId => {
  if (profile?.randomizer) return MODE_OF_RANDOMIZER[profile.randomizer.mode];
  return vanillaSafe ? 'vanilla-safe' : 'vanilla';
};

export { modeOfProfile };
