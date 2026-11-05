/* @layer renderer-components @kind component */
import { Spinner, Stack } from '@drizztdourden08/tessera/primitives';
import type { Profile } from '@drizztdourden08/brock-core';
import { buildControlFacts } from '../behavior/build-control-facts';
import { buildPlayFacts } from '../behavior/build-play-facts';
import { buildSaveFacts } from '../behavior/build-save-facts';
import { useProfileData } from '../behavior/useProfileData';
import { FactsSection } from './FactsSection';

const ProfileDataTab = ({ profile }: { profile: Profile }) => {
  const data = useProfileData(profile.id);

  if (data === null) return <Spinner size="md" />;
  return (
    <Stack gap="lg">
      <FactsSection title="Saves" facts={[buildSaveFacts(data)]} />
      <FactsSection title="Play" facts={[buildPlayFacts(data)]} />
      <FactsSection title="Controls" facts={[buildControlFacts(data)]} />
    </Stack>
  );
};

export { ProfileDataTab };
