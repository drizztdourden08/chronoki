/* @layer renderer-components @kind types */
import type { FunctionAction } from '@chronoki/input-mapping';
import type { ControlsState } from './controls.type';

interface FunctionBindingsTabProps {
  ctrl: ControlsState;
  onRebind: (action: FunctionAction) => void;
}

export type { FunctionBindingsTabProps };
