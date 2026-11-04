/* @layer shared-input @kind types */
import type { ButtonIcon, InputBinding } from '../bindings/bindings.type';
import type { FUNCTION_ACTIONS } from './function-actions.constants';

type FunctionAction = (typeof FUNCTION_ACTIONS)[number];

interface FunctionMapping {
  action: FunctionAction;
  binding: InputBinding;
  icon: ButtonIcon | null;
  sourceVid?: string | null;
  sourcePid?: string | null;
}

export type { FunctionAction, FunctionMapping };
