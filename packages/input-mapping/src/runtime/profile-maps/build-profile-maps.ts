/* @layer renderer-lib @kind logic */
import type { SnesButton } from '../../snes/snes.type';
import type { InputProfile } from '../../profiles/profiles.type';
import { deviceKeyFor, setScoped } from '../device-scoped-map';
import { allowedDevices } from '../profile-devices';
import type { ProfileMaps } from './profile-maps.type';

const buildProfileMaps = (profile: InputProfile | null): ProfileMaps => {
  const maps: ProfileMaps = {
    keyboardMap: new Map<string, SnesButton>(),
    gamepadButtonMap: new Map(),
    gamepadAxisMap: new Map(),
    allowed: allowedDevices(profile),
  };
  if (!profile) return maps;
  for (const mapping of profile.mappings) {
    const b = mapping.binding;
    const device = deviceKeyFor(mapping.sourceVid, mapping.sourcePid);
    if (b.type === 'keyboard') maps.keyboardMap.set(b.code, mapping.snesButton);
    else if (b.type === 'gamepad-button') setScoped(maps.gamepadButtonMap, device, b.index, mapping.snesButton);
    else if (b.type === 'gamepad-axis') setScoped(maps.gamepadAxisMap, device, `${b.axisIndex}:${b.direction}`, mapping.snesButton);
  }
  return maps;
};

export { buildProfileMaps };
