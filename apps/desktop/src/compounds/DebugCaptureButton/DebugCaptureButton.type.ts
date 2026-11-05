/* @layer renderer-components @kind types */
import type { DragHandlers } from '../DebugFloatingControls/DebugFloatingControls.type';

interface DebugCaptureButtonProps extends DragHandlers {
  profileId: string;
  dragging: boolean;
}

export type { DebugCaptureButtonProps };
