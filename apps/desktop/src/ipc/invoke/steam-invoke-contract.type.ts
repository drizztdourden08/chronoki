/* @layer shared-types @kind types */
import type { SteamDetectStatus, SteamPick } from '../steam-detect.type';

interface SteamInvokeContract {
  'steam:detectStart': () => Promise<void>;
  'steam:detectCancel': () => Promise<void>;
  'steam:detectStatus': () => Promise<SteamDetectStatus>;
  'steam:pick': () => Promise<SteamPick | null>;
  'steam:readRange': (path: string, offset: number, length: number) => Promise<Uint8Array>;
}

export type { SteamInvokeContract };
