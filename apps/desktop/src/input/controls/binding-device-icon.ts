/* @layer renderer-components @kind logic */
import type { DetectedDevice, InputBinding } from '@chronoki/input-mapping';
import { GENERIC_DEVICE_ICON, KEYBOARD_DEVICE_ICON } from './controls.constants';
import { deviceIconUrl } from './device-icon-url';

const bindingDeviceIcon = (
  binding: InputBinding,
  vendorId: string | null | undefined,
  productId: string | null | undefined,
  devices: readonly DetectedDevice[],
): string | undefined => {
  if (binding.type === 'none') return undefined;
  if (binding.type === 'keyboard') return KEYBOARD_DEVICE_ICON;
  const device = devices.find((d) => d.vendorId === vendorId && d.productId === productId);
  return device ? deviceIconUrl(device) : GENERIC_DEVICE_ICON;
};

export { bindingDeviceIcon };
