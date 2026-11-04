/* @layer renderer-components @kind types */
import type { useHomeSramImport } from './behavior/useHomeSramImport';

interface SramDialogState {
  type: 'import-sram' | 'import-sram-invalid' | null;
  targetName?: string;
  pendingBytes?: Uint8Array;
  detail?: string;
}

type HomeSramImport = ReturnType<typeof useHomeSramImport>;

interface HomeDialogsProps {
  sramImport: HomeSramImport;
}

interface ProfileFactsInput {
  romFile: string | null;
  lastPlayed: number | undefined;
  created: number | undefined;
}

export type { HomeDialogsProps, HomeSramImport, ProfileFactsInput, SramDialogState };
