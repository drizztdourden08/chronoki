/* @layer electron-main @kind logic */
import { detectSession } from './detect-session';

const cancelDetect = (): void => {
  detectSession.control.cancelled = true;
};

export { cancelDetect };
