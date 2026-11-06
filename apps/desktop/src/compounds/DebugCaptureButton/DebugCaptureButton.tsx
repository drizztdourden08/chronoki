/* @layer renderer-components @kind component */
import { Box, Icon, Pressable } from '@drizztdourden08/tessera/primitives';
import { FfmpegRequiredDialog } from '@drizztdourden08/brock-tools/renderer';
import { useDebugCaptureStore } from '@app/bug-report/debug-capture/useDebugCaptureStore';
import { useDebugCapture } from './behavior/useDebugCapture';
import { RecordingTimer } from './sub-components/RecordingTimer';
import type { DebugCaptureButtonProps } from './DebugCaptureButton.type';
import './DebugCaptureButton.css';

const DebugCaptureButton = ({ profileId, dragging, onPointerDown, onPointerMove, onPointerUp }: DebugCaptureButtonProps) => {
  const isCapturing = useDebugCaptureStore((s) => s.isCapturing);
  const startedAt = useDebugCaptureStore((s) => s.startedAt);
  const { handleClick, showFfmpegPrompt, resolveFfmpegPrompt } = useDebugCapture(profileId);

  return (
    <Box className={`debug-capture-glow${isCapturing ? ' debug-capture-glow--active' : ''}`}>
      <Box as="span" className="debug-capture-glow__layer debug-capture-glow__layer--1" aria-hidden />
      <Box as="span" className="debug-capture-glow__layer debug-capture-glow__layer--2" aria-hidden />
      <Pressable
        className={`debug-round-button debug-capture-button${isCapturing ? ' debug-capture-button--active' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={() => {
          if (!dragging) void handleClick();
        }}
        title={isCapturing ? 'Stop debug capture' : 'Start debug capture'}
        aria-label={isCapturing ? 'Stop debug capture' : 'Start debug capture'}
      >
        <Icon name={isCapturing ? 'square' : 'play'} />
      </Pressable>
      {isCapturing && startedAt !== null && <RecordingTimer startedAt={startedAt} />}
      <FfmpegRequiredDialog open={showFfmpegPrompt} onClose={resolveFfmpegPrompt} />
    </Box>
  );
};

export { DebugCaptureButton };
