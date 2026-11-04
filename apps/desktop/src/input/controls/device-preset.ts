/* @layer renderer-components @kind logic */
import type { DetectedDevice } from '@chronoki/input-mapping';
import type { DevicePreset } from '../profile-edit/profile-edit.type';

const devicePreset = (device: DetectedDevice): DevicePreset => ({
  sdlType: device.type === 'keyboard' ? 'keyboard' : device.sdlType ?? 'generic',
  deviceName: device.displayName,
  vid: device.vendorId ?? '',
  pid: device.productId ?? '',
});

export { devicePreset };
