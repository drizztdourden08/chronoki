/* @layer renderer-components @kind logic */
import { padHex, resolveIconByVidPid } from '@chronoki/input-mapping';
import type { ButtonMapping, DetectedDevice } from '@chronoki/input-mapping';

const resolveDisplayIcon = (mapping: ButtonMapping, devices: readonly DetectedDevice[]): ButtonMapping['icon'] => {
  const storedIcon = mapping.icon?.key ? mapping.icon : null;
  if (mapping.binding.type === 'none' || mapping.binding.type === 'keyboard') return storedIcon;
  if (!mapping.sourceVid || !mapping.sourcePid) return storedIcon;
  const vid = padHex(mapping.sourceVid);
  const pid = padHex(mapping.sourcePid);
  const live = devices.find((d) => d.vendorId && d.productId && padHex(d.vendorId) === vid && padHex(d.productId) === pid);
  return resolveIconByVidPid(vid, pid, mapping.binding, live?.sdlType) ?? storedIcon;
};

export { resolveDisplayIcon };
