/* @layer renderer-components @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import type { DetectedDevice } from '@chronoki/input-mapping';
import type { DevicePreset } from '../profile-edit/profile-edit.type';
import type { ControlsState } from './controls.type';

const presetOf = (device: DetectedDevice): DevicePreset => ({
  sdlType: device.type === 'keyboard' ? 'keyboard' : device.sdlType ?? 'generic',
  deviceName: device.displayName,
  vid: device.vendorId ?? '',
  pid: device.productId ?? '',
});

const DevicesPanel = ({ ctrl }: { ctrl: ControlsState }) => (
  <Box className="controls-settings__side">
    <Text className="controls-settings__section-header">Devices</Text>
    {ctrl.devices.map((device) => (
      <Box key={device.id} className="controls-settings__device">
        <ListItemRow name={device.displayName} meta={device.connected ? 'Connected' : 'Not connected'} />
        <Box className="controls-settings__device-actions">
          <Button size="xs" variant="ghost" onClick={() => ctrl.createForDevice(presetOf(device))}>New profile</Button>
          <Button size="xs" variant="ghost" onClick={() => ctrl.applyToActive(presetOf(device))}>Reset current to defaults</Button>
        </Box>
      </Box>
    ))}
  </Box>
);

export { DevicesPanel };
