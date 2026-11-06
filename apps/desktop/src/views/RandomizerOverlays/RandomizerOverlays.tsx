/* @layer renderer-components @kind component */
import { CheckToasts, DeliveryQueueIndicator } from '@drizztdourden08/brock-randomizer/renderer';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useCheckToastsEnabled } from './behavior/useCheckToastsEnabled';
import { useIsRandomizerRun } from './behavior/useIsRandomizerRun';
import { useNoticeShown } from './behavior/useNoticeShown';
import './RandomizerOverlays.css';

const RandomizerOverlays = ({ profileId }: { profileId: string | null }) => {
  const randomizer = useIsRandomizerRun(profileId);
  const toastsEnabled = useCheckToastsEnabled();
  const noticeShown = useNoticeShown();
  if (!randomizer) return null;
  return (
    <Box className="randomizer-overlays">
      <CheckToasts enabled={toastsEnabled} noticeShown={noticeShown} />
      <DeliveryQueueIndicator />
    </Box>
  );
};

export { RandomizerOverlays };
