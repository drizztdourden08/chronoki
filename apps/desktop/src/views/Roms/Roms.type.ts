/* @layer renderer-components @kind types */
interface RomEntry {
  romFile: string;
  label: string;
  ready: boolean;
  assetBytes: number | null;
}

interface RomStatusMessage {
  success: boolean;
  message: string;
}

export type { RomEntry, RomStatusMessage };
