/* @layer renderer-components @kind types */
import type { RomStatusMessage } from '../Roms.type';

interface RomImportProps {
  busy: boolean;
  status: RomStatusMessage | null;
  onDrop: (files: File[]) => void;
}

export type { RomImportProps };
