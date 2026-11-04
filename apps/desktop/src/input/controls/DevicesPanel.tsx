/* @layer renderer-components @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import { RescanButton, useControllerDevices } from '@drizztdourden08/brock-input/renderer';
import { DeviceRailButton } from './DeviceRailButton';
import { DeviceRow } from './DeviceRow';
import { useFoldWhenNarrow } from './useFoldWhenNarrow';
import { SIDE_PANEL_SIZE } from './controls.constants';
import type { DevicesPanelProps } from './controls.type';

const DevicesPanel = ({ ctrl, onApply }: DevicesPanelProps) => {
  const { isRescanPending, handleRescan } = useControllerDevices();
  const devices = ctrl.devices.filter((d) => !d.displayName.toLowerCase().includes('mouse'));
  const { collapsed, setCollapsed } = useFoldWhenNarrow(false);
  return (
    <SidePanel
      side="end"
      title="Devices"
      {...SIDE_PANEL_SIZE}
      storageKey="controls:devices-width"
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
      railItems={devices.map((device) => (
        <DeviceRailButton key={device.id} device={device} onAssign={onApply} />
      ))}
      action={<RescanButton isPending={isRescanPending} onRescan={handleRescan} />}
      containers={[{
        title: 'Connected devices',
        content: (
          <>
            {devices.map((device) => <DeviceRow key={device.id} device={device} onAssign={onApply} />)}
            {devices.length === 0 && <EmptyState message="No devices detected" />}
          </>
        ),
      }]}
    />
  );
};

export { DevicesPanel };
