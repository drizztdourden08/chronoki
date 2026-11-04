/* @layer shared-input @kind barrel */
import type {} from '@drizztdourden08/brock-core/augment';
export { KEYBOARD_DEFAULT } from './keyboard-default';
export { buildConsoleDefaultMappings } from './build-console-defaults';
export { axisEndLabel } from './axis-end-label';
export { SNES_BUTTONS, SNES_BUTTON_BITS, SNES_BUTTON_LABELS } from './snes/snes.constants';
export type { SnesButton } from './snes/snes.type';
export type {
  ButtonIcon,
  ButtonMapping,
  DeviceFamily,
  GamepadAxisBinding,
  GamepadButtonBinding,
  InputApi,
  InputBinding,
  KeyboardBinding,
} from './bindings/bindings.type';
export { DEFAULT_FUNCTION_MAPPINGS, FUNCTION_ACTIONS, FUNCTION_ACTION_LABELS } from './functions/function-actions.constants';
export type { FunctionAction, FunctionMapping } from './functions/function-mapping.type';
export type { AssignedDevice, DetectedDevice, DevicePreset, InputProfile } from './profiles/profiles.type';
export { INPUT_PROFILES_FILE } from './profiles/profiles.constants';
export { parseInputProfiles } from './profiles/parse-input-profiles';
export { profileFromPreset } from './profiles/profile-from-preset';
export { cycleProfile } from './profiles/cycle-profile';
export { GENERIC_DEFAULTS, resolveAxisConsoleDefault, resolveConsoleDefault } from './console-defaults';
export { detectAllDevices } from './runtime/device-detector/detect-all-devices';
export { detectKeyboard } from './runtime/device-detector/detect-keyboard';
export { deviceKeyFor, setScoped, scopedEntries } from './runtime/device-scoped-map';
export { ANY_DEVICE } from './runtime/device-scoped-map/device-scoped-map.constants';
export type { DeviceScopedMap } from './runtime/device-scoped-map';
export { allowedDevices, padHex } from './runtime/profile-devices';
export type { AllowedDevices } from './runtime/profile-devices';
export { resolveFunctionMappingIcon } from './runtime/profile-utils/resolve-function-mapping-icon';
export { resolveIconByVidPid } from './runtime/profile-utils/resolve-icon-by-vid-pid';
export { buildProfileMaps } from './runtime/profile-maps/build-profile-maps';
export type { ProfileMaps } from './runtime/profile-maps/profile-maps.type';
export { computeBitmask } from './runtime/polling-engine';
export type { BitmaskSources, GamepadMaps, HidDeviceState } from './runtime/polling-engine.type';
export { FunctionActionEngine } from './runtime/function-actions';
export type { FunctionKeyUpListener } from './runtime/function-actions.type';
export { MANUAL_PAUSE } from './runtime/pause-manager.constants';
export { PauseManager } from './runtime/pause-manager';
export type { PauseListener } from './runtime/pause-manager';
export { RawInputDispatcher } from './runtime/raw-input-dispatcher';
export type { AxisDirection, RawInputEvent, RawInputListener } from './runtime/raw-input-dispatcher.type';
export { axisDirection } from './runtime/axis-direction';
export { axisPressed } from './runtime/axis-pressed';
export { resolveAxisPressThreshold, STICK_DIRECTION_PRESS_THRESHOLD } from './runtime/axis-press-threshold';
export { isTextInput } from './runtime/input-manager/is-text-input';
export { notifyQuietly } from './runtime/input-manager/notify-quietly';
export { AXIS_FALLBACK, KEY_CODE_LABELS } from './runtime/binding-display/binding-display.constants';
export { formatKeyBinding } from './runtime/binding-display/format-key-binding';
export { formatKeyCode } from './runtime/binding-display/format-key-code';
export { getBindingLabel } from './runtime/binding-display/get-binding-label';
export { BUTTON_ICON_PATHS } from './runtime/button-icons/button-icon-paths';
export { KEY_CODE_ICON_IDS, SNES_ICON_MAP } from './runtime/button-icons/keyboard-icon-paths.constants';
export { keyCodeToIconId } from './runtime/button-icons/key-code-to-icon-id';
