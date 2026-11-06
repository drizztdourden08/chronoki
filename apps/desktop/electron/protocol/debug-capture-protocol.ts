/* @layer electron-main @kind logic */
import { net, protocol } from 'electron';
import { getUserDataPath } from '@drizztdourden08/brock-electron/main';
import { RECORDINGS_DIR } from '../diagnostics/debug-report/finalize-capture-session';
import { captureFileUrlOf } from './debug-capture-file-path';

const registerDebugCaptureProtocol = (): void => {
  protocol.handle('app-debug-capture', (request) => net.fetch(captureFileUrlOf(getUserDataPath(RECORDINGS_DIR), request.url)));
};

export { registerDebugCaptureProtocol };
