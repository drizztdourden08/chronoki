/* @layer renderer-components @kind types */
import type { SteamDetectStatus } from '@app/ipc';

interface SteamDetectLineProps {
  status: SteamDetectStatus;
  busy: boolean;
  onImport: () => void;
  onCancel: () => void;
  onRescan: () => void;
}

export type { SteamDetectLineProps };
