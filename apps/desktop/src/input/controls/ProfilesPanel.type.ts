/* @layer renderer-components @kind types */
import type { InputProfile } from '@chronoki/input-mapping';
import type { ControlsState } from './controls.type';

interface ProfilesPanelProps {
  ctrl: ControlsState;
  onDelete: (profile: InputProfile) => void;
}

export type { ProfilesPanelProps };
