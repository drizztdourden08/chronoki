/* @layer renderer-components @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { ProfileModeId } from '@app/compounds/ModeBadge';
import type { ProfilePresetId } from '@app/profiles/presets';

interface ReadyRom {
  romFile: string;
  label: string;
}

interface ProfileManagerProps {
  onOpenProfile: (profile: Profile) => void;
}

interface ProfileDetailPanelProps {
  profile: Profile;
  onOpen: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
}

interface ProfileDetailHeaderProps {
  profile: Profile;
  mode: ProfileModeId;
  onOpen: () => void;
  onDelete: () => void;
}

interface ProfileListPaneProps {
  loadingProfile: string | null;
  profiles: Profile[];
  selected: string | null;
  creating: boolean;
  canCreate: boolean;
  onSelect: (id: string) => void;
  onOpen: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
  onCreate: () => void;
}

interface ProfileCreateWizardProps {
  readyRoms: ReadyRom[];
  onCancel: () => void;
  onCreated: (profile: Profile) => void;
}

interface ProfileWizardValues {
  name: string;
  rom: string;
  preset: ProfilePresetId;
  msuPack: string;
  [slice: string]: unknown;
}

interface FactsSectionProps {
  title: string;
  hint?: string;
  facts: readonly FactsPanelFact[][];
}

interface MsuFolderImport {
  busy: boolean;
  percent: number | null;
  error: string | null;
  importFiles: (files: File[]) => Promise<void>;
}

export type { FactsSectionProps, MsuFolderImport, ProfileCreateWizardProps, ProfileDetailHeaderProps, ProfileDetailPanelProps, ProfileListPaneProps, ProfileManagerProps, ProfileWizardValues, ReadyRom };
