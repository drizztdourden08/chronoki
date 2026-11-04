/* @layer renderer-lib @kind types */
interface RomInfo {
  romFile: string;
  label: string;
  hasAssets: boolean;
  assetSize: number | null;
}

export type { RomInfo };
