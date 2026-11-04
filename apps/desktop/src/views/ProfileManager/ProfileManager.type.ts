/* @layer renderer-components @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
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
  readyRoms: ReadyRom[];
  onOpen: (profile: Profile) => void;
  onDelete: (profile: Profile) => void;
}

interface ProfileListPaneProps {
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
}

export type { ProfileCreateWizardProps, ProfileDetailPanelProps, ProfileListPaneProps, ProfileManagerProps, ProfileWizardValues, ReadyRom };
