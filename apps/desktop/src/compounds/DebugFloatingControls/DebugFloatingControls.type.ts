/* @layer renderer-components @kind types */
import type { PointerEvent } from 'react';

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
  icon: string;
  label: string;
  onPress: () => void;
  dragging: boolean;
}

export type { DebugFloatingControlsProps, DebugRoundButtonProps, DragHandlers, DragStart, StoredOffset };
