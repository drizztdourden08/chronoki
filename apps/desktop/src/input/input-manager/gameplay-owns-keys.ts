/* @layer renderer-lib @kind logic */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { isTextInput } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager';

const MODAL_SELECTOR = 'dialog[open], [aria-modal="true"]';

/* While the game is running and nothing sits over it (no screen, no modal, not paused), the game owns the keyboard:
   a key that is not mapped does nothing in the app (no Tab focus walk to the titlebar, no Space on a focused button). */
const gameplayOwnsKeys = (m: InputManager, e: KeyboardEvent): boolean =>
  m.setInputFn !== null
  && !m.inputSuppressed
  && !m.pauseManager.isPaused
  && !isTextInput(e.target)
  && useNavigationStore.getState().active === null
  && document.querySelector(MODAL_SELECTOR) === null;

const releaseFocus = (): void => {
  const el = document.activeElement;
  if (el instanceof HTMLElement && el !== document.body) el.blur();
};

export { gameplayOwnsKeys, releaseFocus };
