/* @layer renderer-components @kind logic */
import { allowedDevices, padHex } from '@chronoki/input-mapping';
import type { DetectedDevice, InputProfile } from '@chronoki/input-mapping';
import { recallControllerName } from '@drizztdourden08/brock-input/renderer';
import { DEVICE_FAMILY_ICON, GENERIC_DEVICE_ICON, KEYBOARD_DEVICE_ICON } from './controls.constants';
import { deviceIconUrl } from './device-icon-url';
import type { RequiredInput } from './controls.type';

const isDevice = (d: DetectedDevice, vid: string, pid: string): boolean =>
  d.type === 'gamepad' && padHex(d.vendorId ?? '') === vid && padHex(d.productId ?? '') === pid;

const assignedGamepad = (key: string, devices: DetectedDevice[]): RequiredInput => {
  const [vid = '', pid = ''] = key.split(':');
  const live = devices.find((d) => isDevice(d, vid, pid));
  const name = recallControllerName({ vendorId: parseInt(vid, 16), productId: parseInt(pid, 16) }) ?? live?.displayName ?? 'Controller';
  return { type: 'gamepad', label: `${name} (${vid}:${pid})`, iconSrc: live ? deviceIconUrl(live) : GENERIC_DEVICE_ICON, connected: Boolean(live) };
};

const profileGamepad = (profile: InputProfile, devices: DetectedDevice[]): RequiredInput => ({
  type: 'gamepad',
  label: profile.name,
  iconSrc: DEVICE_FAMILY_ICON[profile.deviceFamily] ?? GENERIC_DEVICE_ICON,
  connected: devices.some((d) => d.type === 'gamepad' && d.connected),
});

const buildRequiredInputs = (profile: InputProfile | null, devices: DetectedDevice[]): RequiredInput[] => {
  if (!profile) return [];
  const { keyboard, gamepadKeys } = allowedDevices(profile);
  const hasGamepad = profile.mappings.some((m) => m.binding.type !== 'keyboard');
  const pads = gamepadKeys.size > 0 ? [...gamepadKeys].map((key) => assignedGamepad(key, devices)) : [profileGamepad(profile, devices)];
  return [
    ...(keyboard ? [{ type: 'keyboard' as const, label: 'Keyboard', iconSrc: KEYBOARD_DEVICE_ICON, connected: devices.some((d) => d.type === 'keyboard' && d.connected) }] : []),
    ...(hasGamepad ? pads : []),
  ];
};

export { buildRequiredInputs };
