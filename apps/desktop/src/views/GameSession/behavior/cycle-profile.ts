/* @layer renderer-appshell @kind logic */
import { peekInputManager } from '@app/input/input-manager/peek-input-manager';

const cycleProfile = (direction: 1 | -1): void => {
  peekInputManager()?.cycleActiveProfile(direction);
};

export { cycleProfile };
