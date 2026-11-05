/* @layer renderer-app @kind constants */
import type { ProfileModeId } from './profile-mode.type';

const MODE_LABELS: Readonly<Record<ProfileModeId, string>> = {
  'vanilla-safe': 'Vanilla Safe',
  vanilla: 'Vanilla',
  randomizer: 'Randomizer',
  'randomizer-online': 'Archipelago Randomizer',
  'randomizer-archipelia': 'Archipelia',
};

const MODE_OF_RANDOMIZER: Readonly<Record<'local' | 'online' | 'archipelia', ProfileModeId>> = {
  local: 'randomizer',
  online: 'randomizer-online',
  archipelia: 'randomizer-archipelia',
};

export { MODE_LABELS, MODE_OF_RANDOMIZER };
