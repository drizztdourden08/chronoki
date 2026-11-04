/* @layer renderer-components @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { Profile } from '@drizztdourden08/brock-core';
import { MODE_LABELS, PROFILE_TEXT } from '../ProfileManager.constants';

const buildProfileFacts = (profile: Profile): FactsPanelFact[] => [
  { label: 'ROM', value: profile.romFile || PROFILE_TEXT.noRom, title: profile.romFile },
  { label: 'Mode', value: MODE_LABELS[profile.mode] },
  { label: 'Created', value: formatDate(profile.created, 'datetime') },
  { label: 'Last played', value: profile.lastPlayed ? formatDate(profile.lastPlayed, 'relative') : 'Never' },
  { label: 'Profile ID', value: profile.id, mono: true, copyable: true },
];

export { buildProfileFacts };
