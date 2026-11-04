/* @layer renderer-components @kind component */
import { useBugReportStore } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { toggleDebugCapture } from '@app/bug-report/debug-capture/toggle-debug-capture';
import { useAllowDebugLogging } from '@app/bug-report/debug-capture/useAllowDebugLogging';
import { useDebugCapturing } from '@app/bug-report/debug-capture/useDebugCapturing';
import { useSyncCaptureAllowed } from '@app/bug-report/debug-capture/useSyncCaptureAllowed';
import { useDraggablePosition } from './behavior/useDraggablePosition';
import { CAPTURE_START_LABEL, CAPTURE_STOP_LABEL, REPORT_LABEL } from './DebugFloatingControls.constants';
import type { DebugFloatingControlsProps } from './DebugFloatingControls.type';
import { DebugRoundButton } from './sub-components/DebugRoundButton';
import './DebugFloatingControls.css';

const DebugFloatingControls = ({ profileId, gameRunning }: DebugFloatingControlsProps) => {
  const allowDebugLogging = useAllowDebugLogging();
  useSyncCaptureAllowed(allowDebugLogging && gameRunning);
  const capturing = useDebugCapturing();
  const showReport = useBugReportStore((state) => state.show);
  const { stackRef, dragging, handlers } = useDraggablePosition();

  if (!allowDebugLogging || !gameRunning || !profileId) return null;

  return (
    <Box className="debug-floating-controls__hover-zone">
      <Box ref={stackRef} className="debug-floating-controls__stack">
        <DebugRoundButton
          className={capturing ? 'debug-round-button--active' : ''}
          icon={capturing ? 'square' : 'circle-dot'}
          label={capturing ? CAPTURE_STOP_LABEL : CAPTURE_START_LABEL}
          onPress={() => void toggleDebugCapture()}
          dragging={dragging}
          {...handlers}
        />
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
