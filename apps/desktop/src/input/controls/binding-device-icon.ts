/* @layer renderer-components @kind logic */
import { allowedDevices } from '@chronoki/input-mapping';
import type { DetectedDevice, InputProfile } from '@chronoki/input-mapping';
import type { DisplayMapping } from './controls.type';
import { GENERIC_DEVICE_ICON } from './controls.constants';
import { deviceIconUrl } from './device-icon-url';

const bindingDeviceIcon = (
  { binding, sourceVid: vendorId, sourcePid: productId }: Pick<DisplayMapping, 'binding' | 'sourceVid' | 'sourcePid'>,
  devices: readonly DetectedDevice[],
  profile: InputProfile | null,
): string | undefined => {
  if (binding.type === 'none' || binding.type === 'keyboard') return undefined;
  if (!vendorId || !productId || allowedDevices(profile).gamepadKeys.size < 2) return undefined;
  const device = devices.find((d) => d.vendorId === vendorId && d.productId === productId);
  return device ? deviceIconUrl(device) : GENERIC_DEVICE_ICON;
};

export { bindingDeviceIcon };
