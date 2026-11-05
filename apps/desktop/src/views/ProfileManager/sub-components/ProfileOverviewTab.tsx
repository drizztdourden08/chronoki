/* @layer renderer-components @kind component */
import { Card, Stack } from '@drizztdourden08/tessera/primitives';
import type { Profile } from '@drizztdourden08/brock-core';
import type { ProfileModeId } from '@app/compounds/ModeBadge';
import { buildProfileFacts } from '../behavior/build-profile-facts';
import { FactsSection } from './FactsSection';
import { ProfileNameField } from './ProfileNameField';
import { ProfileMsuPackField } from './ProfileMsuPackField';

const ProfileOverviewTab = ({ profile, mode }: { profile: Profile; mode: ProfileModeId }) => (
  <Stack gap="lg">
    <Card title="Edit" level={4}>
      <Stack gap="md">
        <ProfileNameField profile={profile} />
        <ProfileMsuPackField profile={profile} />
      </Stack>
    </Card>
    <FactsSection title="Details" facts={[buildProfileFacts(profile, mode)]} />
  </Stack>
);

export { ProfileOverviewTab };
