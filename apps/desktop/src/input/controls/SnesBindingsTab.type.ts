/* @layer renderer-components @kind types */
import type { SnesButton } from '@chronoki/input-mapping';
import type { ControlsState } from './controls.type';

interface SnesBindingsTabProps {
  ctrl: ControlsState;
  onRebind: (button: SnesButton) => void;
}

export type { SnesBindingsTabProps };
