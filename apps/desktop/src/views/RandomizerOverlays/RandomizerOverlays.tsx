/* @layer renderer-components @kind component */
import { CheckToasts, DeliveryQueueIndicator } from '@drizztdourden08/brock-randomizer/renderer';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useCheckToastsEnabled } from './behavior/useCheckToastsEnabled';
import { useIsRandomizerRun } from './behavior/useIsRandomizerRun';
import { useNoticeColors } from './behavior/useNoticeColors';
import { useNoticeShown } from './behavior/useNoticeShown';
import './RandomizerOverlays.css';

const RandomizerOverlays = ({ profileId }: { profileId: string | null }) => {
  const randomizer = useIsRandomizerRun(profileId);
  const toastsEnabled = useCheckToastsEnabled();
  const noticeShown = useNoticeShown();
  const noticeColors = useNoticeColors();
  if (!randomizer) return null;
  return (
    <Box className="randomizer-overlays">
      <Box className="online-notices" style={noticeColors}>
        <CheckToasts enabled={toastsEnabled} noticeShown={noticeShown} />
      </Box>
      <DeliveryQueueIndicator />
    </Box>
  );
};

export { RandomizerOverlays };
