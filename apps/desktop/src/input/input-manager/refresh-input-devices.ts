/* @layer renderer-lib @kind logic */
import { detectAllDevices, notifyQuietly } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager';

const refreshInputDevices = (m: InputManager): void => {
  m.devices = detectAllDevices(m.hidDeviceCache);
  notifyQuietly(m.deviceListeners, m.devices);
};

export { refreshInputDevices };
