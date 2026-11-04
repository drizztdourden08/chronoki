/* @layer renderer-lib @kind types */
interface SteamMarker {
  version: number;
  sourceName: string;
  sourceBytes: number;
  builtAt: string;
}

interface SteamSource {
  name: string;
  bytes: number;
}

interface WideHeader {
  version: number;
  margins: number;
}

interface SteamImportResult {
  success: boolean;
  error?: string;
}

export type { SteamImportResult, SteamMarker, SteamSource, WideHeader };
