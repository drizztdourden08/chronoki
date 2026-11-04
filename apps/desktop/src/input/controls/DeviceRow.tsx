/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { DeviceIcon } from './DeviceIcon';
import { deviceIconUrl } from './device-icon-url';
import { devicePreset } from './device-preset';
import type { DeviceRowProps } from './controls.type';

const DeviceRow = ({ device, onAssign }: DeviceRowProps) => {
  const handleClick = useCallback(() => onAssign(devicePreset(device)), [onAssign, device]);
  return (
    <Box className="device-row" data-device-id={device.id}>
      <ListItemRow
        icon={<DeviceIcon src={deviceIconUrl(device)} family={device.deviceFamily} ready={device.connected} />}
        name={device.displayName}
        meta={device.connected ? 'Connected' : 'Not connected'}
        onClick={device.connected ? handleClick : undefined}
      />
    </Box>
  );
};

export { DeviceRow };
