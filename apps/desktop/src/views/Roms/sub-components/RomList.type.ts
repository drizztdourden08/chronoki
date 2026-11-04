/* @layer renderer-components @kind types */
import type { RomEntry } from '../Roms.type';

interface RomListProps {
  roms: RomEntry[];
  selected: string | null;
  busy: boolean;
  onSelect: (romFile: string) => void;
  onDelete: (romFile: string) => void;
}

export type { RomListProps };
