/* @layer renderer-components @kind logic */
import { allowedDevices } from '@chronoki/input-mapping';
import type { DetectedDevice, InputBinding, InputProfile } from '@chronoki/input-mapping';
import { GENERIC_DEVICE_ICON } from './controls.constants';
import { deviceIconUrl } from './device-icon-url';

const bindingDeviceIcon = (
  binding: InputBinding,
  vendorId: string | null | undefined,
  productId: string | null | undefined,
  devices: readonly DetectedDevice[],
  profile: InputProfile | null,
): string | undefined => {
  if (binding.type === 'none' || binding.type === 'keyboard') return undefined;
  if (!vendorId || !productId || allowedDevices(profile).gamepadKeys.size < 2) return undefined;
  const device = devices.find((d) => d.vendorId === vendorId && d.productId === productId);
  return device ? deviceIconUrl(device) : GENERIC_DEVICE_ICON;
};

export { bindingDeviceIcon };
