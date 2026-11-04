/* @layer electron-main @kind logic */
import type { SteamDetectStatus } from '@app/ipc/steam-detect.type';
import { detectSession } from './detect-session';

const detectStatus = (): SteamDetectStatus => {
  const { state, control, path, size } = detectSession;
  return { state, visited: control.visits, ...(path === undefined ? {} : { path }), ...(size === undefined ? {} : { size }) };
};

export { detectStatus };
