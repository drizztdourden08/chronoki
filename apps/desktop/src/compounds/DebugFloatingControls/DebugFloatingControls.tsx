/* @layer renderer-components @kind component */
import { useBugReportStore } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { useAllowDebugLogging } from '@app/bug-report/debug-capture/useAllowDebugLogging';
import { useSyncCaptureAllowed } from '@app/bug-report/debug-capture/useSyncCaptureAllowed';
import { DebugCaptureButton } from '../DebugCaptureButton';
import { useDraggablePosition } from './behavior/useDraggablePosition';
import { REPORT_LABEL } from './DebugFloatingControls.constants';
import type { DebugFloatingControlsProps } from './DebugFloatingControls.type';
import { DebugRoundButton } from './sub-components/DebugRoundButton';
import './DebugFloatingControls.css';

const DebugFloatingControls = ({ profileId, gameRunning }: DebugFloatingControlsProps) => {
  const allowDebugLogging = useAllowDebugLogging();
  useSyncCaptureAllowed(allowDebugLogging && gameRunning);
  const showReport = useBugReportStore((state) => state.show);
  const { stackRef, dragging, handlers } = useDraggablePosition();

  if (!allowDebugLogging || !gameRunning || !profileId) return null;

  return (
    <Box className="debug-floating-controls__hover-zone">
      <Box ref={stackRef} className="debug-floating-controls__stack">
        <DebugCaptureButton profileId={profileId} dragging={dragging} {...handlers} />
        <DebugRoundButton
          className=""
          icon="send"
          label={REPORT_LABEL}
          onPress={() => showReport()}
          dragging={dragging}
          {...handlers}
        />
      </Box>
    </Box>
  );
};

export { DebugFloatingControls };
