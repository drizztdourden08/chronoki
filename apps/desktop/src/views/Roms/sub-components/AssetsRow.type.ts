/* @layer renderer-components @kind types */
import type { RomEntry } from '../Roms.type';

interface AssetsRowProps {
  rom: RomEntry;
  busy: boolean;
  refused: boolean;
  onRebuild: (romFile: string) => void;
}

export type { AssetsRowProps };
