/* @layer renderer-components @kind logic */
import type { DetectedDevice } from '@chronoki/input-mapping';
import { DEVICE_FAMILY_ICON, GENERIC_DEVICE_ICON, KEYBOARD_DEVICE_ICON, SDL_TYPE_ICON } from './controls.constants';

const deviceIconUrl = (device: Pick<DetectedDevice, 'type' | 'deviceFamily' | 'sdlType'>): string => {
  if (device.type === 'keyboard') return KEYBOARD_DEVICE_ICON;
  return (device.sdlType && SDL_TYPE_ICON[device.sdlType]) ?? DEVICE_FAMILY_ICON[device.deviceFamily] ?? GENERIC_DEVICE_ICON;
};

export { deviceIconUrl };
