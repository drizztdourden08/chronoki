/* @layer renderer-components @kind types */
import type { DetectedDevice, FunctionAction, FunctionMapping, InputBinding, InputProfile, SnesButton } from '@chronoki/input-mapping';
import type { DevicePreset } from '../profile-edit/profile-edit.type';

type ListeningTarget =
  | { type: 'snes'; button: SnesButton }
  | { type: 'function'; action: FunctionAction };

type ControlsTab = 'controls' | 'shortcuts' | 'options';

type CaptureHandler = (binding: InputBinding, sourceDeviceKey?: string, vendorId?: string | null, productId?: string | null) => void;

interface DisplayMapping {
  button: SnesButton;
  mappingIndex: number;
  binding: InputBinding;
  icon: InputProfile['mappings'][number]['icon'];
}

interface ControlsState {
  profiles: InputProfile[];
  activeProfile: InputProfile | null;
  functionMappings: FunctionMapping[];
  devices: DetectedDevice[];
  newlyCreatedId: string | null;
  select: (profile: InputProfile) => void;
  create: () => void;
  rename: (profile: InputProfile, name: string) => void;
  remove: (profile: InputProfile) => void;
  bindSnes: (button: SnesButton, binding: InputBinding, vid: string | null, pid: string | null) => void;
  clearSnes: (button: SnesButton, mappingIndex: number) => void;
  bindFunction: (action: FunctionAction, binding: InputBinding, vid: string | null, pid: string | null) => void;
  clearFunction: (action: FunctionAction) => void;
  createForDevice: (preset: DevicePreset) => void;
  applyToActive: (preset: DevicePreset) => void;
}

interface ControlsProps {
  profileId: string;
}

interface BindingListenerProps {
  actionLabel: string;
  onCapture: CaptureHandler;
  onCancel: () => void;
}

interface BindingRowProps {
  actionLabel: string;
  middleLabel?: string;
  middleIconId?: string;
  binding: InputBinding;
  icon?: DisplayMapping['icon'];
  onRebind: () => void;
  onClear: () => void;
}

interface BindingListHeaderProps {
  middleLabel?: string;
}

interface RequiredInput {
  type: 'keyboard' | 'gamepad';
  label: string;
  iconSrc: string;
  connected: boolean;
}

interface RequiredInputStateProps {
  input: RequiredInput;
}

interface DeviceRowProps {
  device: DetectedDevice;
  onAssign: (preset: DevicePreset) => void;
}

interface DevicesPanelProps {
  ctrl: ControlsState;
  onApply: (preset: DevicePreset) => void;
}

interface CtrlProps {
  ctrl: ControlsState;
}

export type { BindingListHeaderProps, CtrlProps, DeviceRowProps, DevicesPanelProps, RequiredInput, RequiredInputStateProps, BindingListenerProps, BindingRowProps, CaptureHandler, ControlsProps, ControlsState, ControlsTab, DisplayMapping, ListeningTarget };
