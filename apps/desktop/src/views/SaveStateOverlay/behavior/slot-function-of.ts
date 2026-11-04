/* @layer renderer-components @kind logic */
import type { FunctionAction } from '@chronoki/input-mapping';
import { isFunctionBound } from '@app/input/input-manager/is-function-bound';

const slotFunctionOf = (slot: number): FunctionAction => {
  const perSlot = `save-state-${slot + 1}` as FunctionAction;
  return isFunctionBound(perSlot) ? perSlot : 'save-state';
};

export { slotFunctionOf };
