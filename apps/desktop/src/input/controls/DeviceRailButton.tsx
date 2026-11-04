/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { IconButton } from '@drizztdourden08/tessera/primitives';
import { DeviceIcon } from './DeviceIcon';
import { deviceIconUrl } from './device-icon-url';
import { devicePreset } from './device-preset';
import type { DeviceRowProps } from './controls.type';

const DeviceRailButton = ({ device, onAssign }: DeviceRowProps) => {
  const handleClick = useCallback(() => onAssign(devicePreset(device)), [onAssign, device]);
  return (
    <IconButton variant="ghost" size="sm" label={device.displayName} disabled={!device.connected} onClick={handleClick}>
      <DeviceIcon src={deviceIconUrl(device)} family={device.deviceFamily} ready={device.connected} />
    </IconButton>
  );
};

export { DeviceRailButton };
