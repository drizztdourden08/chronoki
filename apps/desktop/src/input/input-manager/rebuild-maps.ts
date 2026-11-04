/* @layer renderer-lib @kind logic */
import { buildProfileMaps } from '@chronoki/input-mapping';
import type { InputManager } from './input-manager';

const rebuildMaps = (m: InputManager): void => {
  const maps = buildProfileMaps(m.activeProfile);
  m.keyboardMap = maps.keyboardMap;
  m.gamepadButtonMap = maps.gamepadButtonMap;
  m.gamepadAxisMap = maps.gamepadAxisMap;
  m.allowed = maps.allowed;
};

export { rebuildMaps };
