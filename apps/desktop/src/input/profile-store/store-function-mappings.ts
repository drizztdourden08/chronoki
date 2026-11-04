/* @layer renderer-lib @kind logic */
import type { FunctionMapping } from '@chronoki/input-mapping';
import type { InputManager } from '../input-manager/input-manager';
import { commitInputState } from './commit-input-state';

const storeFunctionMappings = (m: InputManager, mappings: FunctionMapping[]): Promise<void> => {
  m.setFunctionMappings(mappings);
  return commitInputState(m);
};

export { storeFunctionMappings };
