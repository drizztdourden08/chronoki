/* @layer shared-types @kind types */
type SteamDetectState = 'idle' | 'scanning' | 'found' | 'notFound' | 'cancelled';

interface SteamDetectStatus {
  state: SteamDetectState;
  visited: number;
  path?: string;
  size?: number;
}

interface SteamPick {
  path: string;
  size: number;
}

export type { SteamDetectState, SteamDetectStatus, SteamPick };
