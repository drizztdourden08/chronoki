/* @layer renderer-lib @kind logic */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { isTextInput } from '@chronoki/input-mapping';
import { MODAL_SELECTOR } from './gameplay-owns-keys.constants';
import type { InputManager } from './input-manager';

const gameplayOwnsKeys = (m: InputManager, e: KeyboardEvent): boolean =>
  m.setInputFn !== null
  && !m.inputSuppressed
  && !m.pauseManager.isPaused
  && !isTextInput(e.target)
  && useNavigationStore.getState().active === null
  && document.querySelector(MODAL_SELECTOR) === null;

export { gameplayOwnsKeys };
