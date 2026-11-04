/* @layer renderer-components @kind types */
import type { PointerEvent } from 'react';
import type { IconName } from '@drizztdourden08/tessera/primitives';

interface DebugFloatingControlsProps {
  profileId: string | null;
  gameRunning: boolean;
}

interface StoredOffset {
  top: number;
  right: number;
}

interface DragHandlers {
  onPointerDown: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: () => void;
}

interface DragStart {
  x: number;
  y: number;
  top: number;
  right: number;
}

interface DebugRoundButtonProps extends DragHandlers {
  className: string;
  icon: IconName;
  label: string;
  onPress: () => void;
  dragging: boolean;
}

export type { DebugFloatingControlsProps, DebugRoundButtonProps, DragHandlers, DragStart, StoredOffset };
