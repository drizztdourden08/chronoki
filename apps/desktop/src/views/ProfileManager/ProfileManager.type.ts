/* @layer renderer-components @kind types */
import type { Profile } from '@drizztdourden08/brock-core';
import type { ProfileMode } from '@app/profiles/types';

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
  onCreated: (profileId: string) => void;
}

interface ProfileWizardValues {
  name: string;
  rom: string;
  mode: ProfileMode;
}

export type { ProfileCreateWizardProps, ProfileDetailPanelProps, ProfileListPaneProps, ProfileManagerProps, ProfileWizardValues, ReadyRom };
