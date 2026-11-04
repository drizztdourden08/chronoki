/* @layer electron-main @kind types */
import type { SteamDetectState } from '@app/ipc/steam-detect.type';
import type { ScanControl } from './steam-detect.type';

interface DetectSession {
  state: SteamDetectState;
  control: ScanControl;
  path?: string;
  size?: number;
  allowed: string | null;
}

export type { DetectSession };
