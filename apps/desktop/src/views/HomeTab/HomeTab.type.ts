/* @layer renderer-components @kind types */
import type { NamedSaveEntry } from '@drizztdourden08/brock-port-kit';
import type { HeroProgressFile } from '@app/compounds/ProfileHero';
import type { ArmedAction } from '@app/compounds/ArmedActionButton';
import type { useHomeSramImport } from './behavior/useHomeSramImport';
import type { useNormalSaves } from './behavior/useNormalSaves';

interface SramDialogState {
  type: 'import-sram' | 'import-sram-invalid' | 'import-sram-unverified' | null;
  verified?: number;
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

interface HomeRandomizerStatus {
  sessionStatusLabel: string;
}

interface HomeFact {
  label: string;
  value: string;
  title?: string;
  mono?: boolean;
}

interface RandomizedProgressProps {
  files: HeroProgressFile[];
  profileId: string | null;
  romFile: string | null;
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

interface HomeSectionProps {
  profileId: string | null;
  running: boolean;
}

type TitlePendulumState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'ready'; url: string; width: number; height: number };

export type {
  ArmedRow, CreateSaveFormProps, HomeDialogsProps, HomeFact, HomeRandomizerStatus, HomeSectionProps, HomeSramImport,
  HomeTabProps, NamedSavesData, NormalSaves, NormalSavesSectionProps, ProfileFactsInput, RandomizedProgressProps, SaveRowPartsInput, SramDialogState, TitlePendulumState,
};
