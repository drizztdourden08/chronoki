/* @layer renderer-components @kind component */
import { Card, Stack } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { Profile } from '@drizztdourden08/brock-core';
import { buildProfileFacts } from '../behavior/build-profile-facts';
import { ProfileNameField } from './ProfileNameField';
import { ProfileMsuPackField } from './ProfileMsuPackField';

const ProfileOverviewTab = ({ profile, modeLabel }: { profile: Profile; modeLabel: string }) => (
  <Stack gap="lg">
    <Card title="Edit" level={4}>
      <Stack gap="md">
        <ProfileNameField profile={profile} />
        <ProfileMsuPackField profile={profile} />
      </Stack>
    </Card>
    <Card title="Details" level={4}>
      <FactsPanel groups={[buildProfileFacts(profile, modeLabel)]} layout="rows" label="Details" />
    </Card>
  </Stack>
);

export { ProfileOverviewTab };
