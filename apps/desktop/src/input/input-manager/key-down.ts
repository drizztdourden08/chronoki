/* @layer renderer-lib @kind logic */
import { isTextInput } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager';

const isShortcutChord = (e: KeyboardEvent): boolean =>
  (e.ctrlKey || e.metaKey) && !e.code.startsWith('Control') && !e.code.startsWith('Meta');

const keyDown = (m: InputManager, e: KeyboardEvent): void => {
  if (isTextInput(e.target)) return;
  if (e.code === 'Escape' || e.key === 'Escape') return;
  m.allPressedKeys.add(e.code);
  m.rawDispatcher.emit({ type: 'keyboard', code: e.code }, 'keyboard');

  if (!m.setInputFn || m.inputSuppressed) return;
  if (isShortcutChord(e)) return;

  if (!e.repeat && m.functionActions.handleKeyDown(e.code, e.shiftKey, e.ctrlKey, e.altKey)) {
    e.preventDefault();
    return;
  }

  if (m.keyboardMap.has(e.code)) {
    e.preventDefault();
    m.keyStates.set(e.code, true);
  }
};

export { keyDown };
