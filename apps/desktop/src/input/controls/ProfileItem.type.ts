/* @layer renderer-components @kind types */
import type { InputProfile } from '@chronoki/input-mapping';

interface ProfileItemProps {
  profile: InputProfile;
  active: boolean;
  startEditing: boolean;
  canDelete: boolean;
  onSelect: (profile: InputProfile) => void;
  onRename: (profile: InputProfile, name: string) => void;
  onDelete: (profile: InputProfile) => void;
}

export type { ProfileItemProps };
