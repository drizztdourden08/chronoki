/* @layer renderer-components @kind component */
import { CheckToasts, DeliveryQueueIndicator } from '@drizztdourden08/brock-randomizer/renderer';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useIsRandomizerRun } from './behavior/useIsRandomizerRun';
import './RandomizerOverlays.css';

const RandomizerOverlays = ({ profileId }: { profileId: string | null }) => {
  const randomizer = useIsRandomizerRun(profileId);
  if (!randomizer) return null;
  return (
    <Box className="randomizer-overlays">
      <CheckToasts />
      <DeliveryQueueIndicator />
    </Box>
  );
};

export { RandomizerOverlays };
