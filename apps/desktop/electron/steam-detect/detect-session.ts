/* @layer electron-main @kind logic */
import type { SteamDetectState } from '@app/ipc/steam-detect.type';
import type { ScanControl } from './steam-detect.type';

interface DetectSession {
  state: SteamDetectState;
  control: ScanControl;
  path?: string;
  size?: number;
  allowed: string | null;
}

const detectSession: DetectSession = {
  state: 'idle',
  control: { visits: 0, cancelled: false, limit: 0 },
  allowed: null,
};

export { detectSession };
