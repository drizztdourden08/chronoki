/* @layer renderer-components @kind component */
import { CheckToasts, DeliveryQueueIndicator } from '@drizztdourden08/brock-randomizer/renderer';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useCheckToastsEnabled } from './behavior/useCheckToastsEnabled';
import { useHighlightColors } from './behavior/useHighlightColors';
import { useIsRandomizerRun } from './behavior/useIsRandomizerRun';
import { useNoticeShown } from './behavior/useNoticeShown';
import './RandomizerOverlays.css';

const RandomizerOverlays = ({ profileId }: { profileId: string | null }) => {
  const randomizer = useIsRandomizerRun(profileId);
  const toastsEnabled = useCheckToastsEnabled();
  const noticeShown = useNoticeShown();
  const { itemColor, playerColor } = useHighlightColors();
  if (!randomizer) return null;
  return (
    <Box className="randomizer-overlays">
      <CheckToasts enabled={toastsEnabled} noticeShown={noticeShown} itemColor={itemColor} playerColor={playerColor} />
      <DeliveryQueueIndicator />
    </Box>
  );
};

export { RandomizerOverlays };
