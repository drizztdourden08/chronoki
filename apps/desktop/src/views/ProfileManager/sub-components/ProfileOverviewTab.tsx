/* @layer renderer-components @kind component */
import { Card, Field, Grid, Select, Stack } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { Profile } from '@drizztdourden08/brock-core';
import { updateProfile } from '@app/storage/profile-store';
import type { ProfileMode } from '@app/profiles/types';
import { MODE_OPTIONS } from '../ProfileManager.constants';
import type { ReadyRom } from '../ProfileManager.type';
import { buildProfileFacts } from '../behavior/build-profile-facts';
import { ProfileNameField } from './ProfileNameField';

const ProfileOverviewTab = ({ profile, readyRoms }: { profile: Profile; readyRoms: ReadyRom[] }) => (
  <Stack gap="lg">
    <Card title="Edit" level={4}>
      <Stack gap="md">
        <ProfileNameField profile={profile} />
        <Grid columns={2} gap="md">
          <Field label="ROM">
            <Select
              value={profile.romFile}
              onChange={(romFile) => void updateProfile(profile.id, { romFile })}
              options={readyRoms.map((rom) => ({ value: rom.romFile, label: rom.romFile }))}
              placeholder="Select ROM..."
            />
          </Field>
          <Field label="Mode">
            <Select
              value={profile.mode}
              onChange={(mode) => void updateProfile(profile.id, { mode: mode as ProfileMode })}
              options={MODE_OPTIONS}
            />
          </Field>
        </Grid>
      </Stack>
    </Card>
    <Card title="Details" level={4}>
      <FactsPanel groups={[buildProfileFacts(profile)]} layout="rows" label="Details" />
    </Card>
  </Stack>
);

export { ProfileOverviewTab };
