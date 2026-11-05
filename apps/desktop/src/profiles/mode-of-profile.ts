/* @layer renderer-app @kind logic */
import { MODE_OF_RANDOMIZER } from './profile-mode-labels.constants';
import type { ProfileModeId } from './profile-mode.type';

type ModeSource = { randomizer?: { mode: 'local' | 'online' | 'archipelia' } } | null | undefined;

const modeOfProfile = (profile: ModeSource, vanillaSafe: boolean): ProfileModeId => {
  if (profile?.randomizer) return MODE_OF_RANDOMIZER[profile.randomizer.mode];
  return vanillaSafe ? 'vanilla-safe' : 'vanilla';
};

export { modeOfProfile };
