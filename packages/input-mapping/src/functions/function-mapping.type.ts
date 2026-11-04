/* @layer shared-input @kind types */
import type { ButtonIcon, InputBinding } from '../bindings/bindings.type';

type SlotNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type SlotFunctionAction = `save-state-${SlotNumber}` | `load-state-${SlotNumber}`;

type BaseFunctionAction =
  | 'save-state'
  | 'load-state'
  | 'slot-next'
  | 'slot-prev'
  | 'turbo'
  | 'menu'
  | 'screenshot'
  | 'pause'
  | 'reset'
  | 'fullscreen'
  | 'toggle-debug-capture'
  | 'profile-prev'
  | 'profile-next';

type FunctionAction = BaseFunctionAction | SlotFunctionAction;

interface FunctionMapping {
  action: FunctionAction;
  binding: InputBinding;
  icon: ButtonIcon | null;
  sourceVid?: string | null;
  sourcePid?: string | null;
}

export type { BaseFunctionAction, FunctionAction, FunctionMapping, SlotFunctionAction, SlotNumber };
