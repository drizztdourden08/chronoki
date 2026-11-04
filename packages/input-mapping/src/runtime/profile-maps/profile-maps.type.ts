/* @layer renderer-lib @kind types */
import type { SnesButton } from '../../snes/snes.type';
import type { DeviceScopedMap } from '../device-scoped-map';
import type { AllowedDevices } from '../profile-devices';

interface ProfileMaps {
  keyboardMap: Map<string, SnesButton>;
  gamepadButtonMap: DeviceScopedMap<number, SnesButton>;
  gamepadAxisMap: DeviceScopedMap<string, SnesButton>;
  allowed: AllowedDevices;
}

export type { ProfileMaps };
