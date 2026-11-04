/* @layer renderer-lib @kind logic */
import { isTextInput } from '@chronoki/input-mapping';
import { gameplayOwnsKeys } from './gameplay-owns-keys';
import type { InputManager } from './input-manager';
import { releaseFocus } from './release-focus';

const isShortcutChord = (e: KeyboardEvent): boolean =>
  (e.ctrlKey || e.metaKey) && !e.code.startsWith('Control') && !e.code.startsWith('Meta');

const isEscape = (e: KeyboardEvent): boolean => e.code === 'Escape' || e.key === 'Escape';

const handleMapped = (m: InputManager, e: KeyboardEvent): boolean => {
  if (!e.repeat && m.functionActions.handleKeyDown(e.code, e.shiftKey, e.ctrlKey, e.altKey)) return true;
  if (!m.keyboardMap.has(e.code)) return false;
  m.keyStates.set(e.code, true);
  return true;
};

const keyDown = (m: InputManager, e: KeyboardEvent): void => {
  if (isTextInput(e.target) || isEscape(e)) return;
  m.allPressedKeys.add(e.code);
  m.rawDispatcher.emit({ type: 'keyboard', code: e.code }, 'keyboard');

  if (!m.setInputFn || m.inputSuppressed || isShortcutChord(e)) return;

  if (handleMapped(m, e)) {
    e.preventDefault();
    return;
  }

  if (gameplayOwnsKeys(m, e)) {
    e.preventDefault();
    releaseFocus();
  }
};

export { keyDown };
