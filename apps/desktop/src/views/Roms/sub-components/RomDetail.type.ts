/* @layer renderer-components @kind types */
import type { RomDetailInfo } from '@app/storage/roms-store';
import type { RomEntry } from '../Roms.type';

interface RomDetailProps {
  rom: RomEntry;
  detail: RomDetailInfo | null;
  loading: boolean;
  busy: boolean;
  onRebuild: (romFile: string) => void;
  onDelete: (romFile: string) => void;
}

export type { RomDetailProps };
