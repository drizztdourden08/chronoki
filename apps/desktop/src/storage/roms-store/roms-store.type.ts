/* @layer renderer-lib @kind types */
interface RomInfo {
  romFile: string;
  label: string;
  hasAssets: boolean;
  assetSize: number | null;
}

interface RomDetailInfo {
  verdict: 'known' | 'unknown' | 'refused';
  hash: string;
  identity: string | null;
  size: number | null;
  refusal: string | null;
}

export type { RomDetailInfo, RomInfo };
