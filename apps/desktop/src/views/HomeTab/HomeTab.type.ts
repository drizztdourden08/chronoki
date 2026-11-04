/* @layer renderer-components @kind types */
import type { NamedSaveEntry } from '@drizztdourden08/brock-port-kit';
import type { ArmedAction } from '@app/compounds/ArmedActionButton';
import type { useHomeSramImport } from './behavior/useHomeSramImport';
import type { useNormalSaves } from './behavior/useNormalSaves';

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

type NormalSaves = ReturnType<typeof useNormalSaves>;

interface NormalSavesSectionProps {
  normal: NormalSaves;
  running: boolean;
}

interface HomeTabProps extends HomeSectionProps {
  normal: NormalSaves;
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
  ArmedRow, CreateSaveFormProps, HomeDialogsProps, HomeSectionProps, HomeSramImport, HomeTabProps, NamedSavesData,
  NormalSaves, NormalSavesSectionProps, ProfileFactsInput, SaveRowPartsInput, SlotInfo, SramDialogState,
};
