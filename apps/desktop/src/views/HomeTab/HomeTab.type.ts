/* @layer renderer-components @kind types */
import type { NamedSaveEntry } from '@drizztdourden08/brock-port-kit';
import type { ArmedAction } from '@app/compounds/ArmedActionButton';
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

interface NamedSavesData {
  list: NamedSaveEntry[];
  screenshots: Record<string, string>;
}

interface ArmedRow {
  id: string;
  action: ArmedAction;
}

interface SaveRowPartsInput {
  screenshotUrl: string | null;
  savedAt: number;
  busy: boolean;
  armed: ArmedAction | null;
}

interface CreateSaveFormProps {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

interface SlotInfo {
  slot: number;
  savedAt: number | null;
  screenshot: string | null;
}

interface HomeSectionProps {
  profileId: string | null;
  running: boolean;
}

export type {
  ArmedRow, CreateSaveFormProps, HomeDialogsProps, HomeSectionProps, HomeSramImport, NamedSavesData, ProfileFactsInput,
  SaveRowPartsInput, SlotInfo, SramDialogState,
};
