/* @layer electron-main @kind logic */
import { registerDebugCaptureProtocol } from '../protocol/debug-capture-protocol';

const onReady = (): void => {
  registerDebugCaptureProtocol();
};

export { onReady };
