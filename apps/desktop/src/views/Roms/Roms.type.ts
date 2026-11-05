/* @layer renderer-components @kind types */
import type { RomDetailInfo } from '@app/storage/roms-store';

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

interface RomBuildResult extends RomStatusMessage {
  spriteError: string | null;
}

interface RomDetailView extends RomDetailInfo {
  name: string;
  created: string | null;
  modified: string | null;
}

export type { RomBuildResult, RomDetailView, RomEntry, RomStatusMessage };
