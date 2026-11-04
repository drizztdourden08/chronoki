/* @layer renderer-appshell @kind logic */
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { presentedFrames } from './presented-frames';
import { waitForFrames } from './wait-for-frames';

const keyEvent = (type: 'keydown' | 'keyup', code: string): void => {
  window.dispatchEvent(new KeyboardEvent(type, { code, key: code, bubbles: true, cancelable: true }));
};

const pressButton = async (button: string, holdFrames: number): Promise<boolean> => {
  const entry = [...getInputManager().keyboardMap].find(([, mapped]) => mapped === button);
  if (!entry) return false;
  keyEvent('keydown', entry[0]);
  await waitForFrames(presentedFrames() + holdFrames);
  keyEvent('keyup', entry[0]);
  return true;
};

export { pressButton };
