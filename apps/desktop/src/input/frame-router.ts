/* @layer renderer-lib @kind logic */
import { computeBitmask } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager/input-manager';

const routeInputFrame = (m: InputManager): void => {
  m.setInputFn?.(computeBitmask(m));
};

export { routeInputFrame };
