/* @layer renderer-lib @kind logic */
import { isTextInput } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager';

const guardKeys = (m: InputManager, e: KeyboardEvent): void => {
  if (e.code === 'Escape' || e.key === 'Escape') return;
  if (isTextInput(e.target) || m.inputSuppressed) e.stopPropagation();
};

export { guardKeys };
