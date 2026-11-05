/* @layer renderer-components @kind types */
import type { RomDetailView, RomEntry, RomStatusMessage } from '../Roms.type';

interface RomDetailProps {
  rom: RomEntry;
  detail: RomDetailView | null;
  loading: boolean;
  busy: boolean;
  status: RomStatusMessage | null;
  onRebuild: (romFile: string) => void;
}

export type { RomDetailProps };
