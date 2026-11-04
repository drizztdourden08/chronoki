/* @layer renderer-lib @kind logic */
import type { FunctionAction } from '@chronoki/input-mapping';
import { getInputManager } from './get-input-manager';

const isFunctionBound = (action: FunctionAction): boolean =>
  getInputManager().getFunctionMappings().some((entry) => entry.action === action && entry.binding.type !== 'none');

export { isFunctionBound };
