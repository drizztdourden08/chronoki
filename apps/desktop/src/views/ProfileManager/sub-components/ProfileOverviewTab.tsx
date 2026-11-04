/* @layer renderer-components @kind component */
import { Card, Field, Select, Stack } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { Profile } from '@drizztdourden08/brock-core';
import { updateProfile } from '@app/storage/profile-store';
import { MODE_LABELS } from '@app/views/HomeTab/HomeTab.constants';
import type { ReadyRom } from '../ProfileManager.type';
import { buildProfileFacts } from '../behavior/build-profile-facts';
import { useProfileSettings } from '../behavior/useProfileSettings';
import { ProfileNameField } from './ProfileNameField';

const ProfileOverviewTab = ({ profile, readyRoms }: { profile: Profile; readyRoms: ReadyRom[] }) => {
  const settings = useProfileSettings(profile.id);
  const modeLabel = MODE_LABELS[settings?.vanillaSafe === true ? 'vanilla-safe' : 'vanilla'];
  return (
    <Stack gap="lg">
      <Card title="Edit" level={4}>
        <Stack gap="md">
          <ProfileNameField profile={profile} />
          <Field label="ROM">
            <Select
              value={profile.romFile}
              onChange={(romFile) => void updateProfile(profile.id, { romFile })}
              options={readyRoms.map((rom) => ({ value: rom.romFile, label: rom.romFile }))}
              placeholder="Select ROM..."
            />
          </Field>
        </Stack>
      </Card>
      <Card title="Details" level={4}>
        <FactsPanel groups={[buildProfileFacts(profile, modeLabel)]} layout="rows" label="Details" />
      </Card>
    </Stack>
  );
};

export { ProfileOverviewTab };
