/* @layer renderer-components @kind component */
import { Card, Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { Profile } from '@drizztdourden08/brock-core';
import { buildPlayFacts } from '../behavior/build-play-facts';
import { buildSaveFacts } from '../behavior/build-save-facts';
import { useProfileData } from '../behavior/useProfileData';

const ProfileDataTab = ({ profile }: { profile: Profile }) => {
  const data = useProfileData(profile.id);

  if (data === null) return <Spinner size="md" />;
  return (
    <Stack gap="lg">
      <Card title="Saves" level={4}>
        <FactsPanel groups={[buildSaveFacts(data)]} layout="rows" label="Saves" />
      </Card>
      <Card title="Play" level={4}>
        <FactsPanel groups={[buildPlayFacts(data)]} layout="rows" label="Play" />
      </Card>
    </Stack>
  );
};

export { ProfileDataTab };
