/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { SNES_BUTTON_LABELS } from '@chronoki/input-mapping';
import { BindingListHeader } from './BindingListHeader';
import { BindingRow } from './BindingRow';
import { buildDisplayMappings } from './build-display-mappings';
import { bindingDeviceIcon } from './binding-device-icon';
import { SNES_ACTION_LABELS, SNES_ICON_IDS } from './controls.constants';
import type { SnesBindingsTabProps } from './SnesBindingsTab.type';

const SnesBindingsTab = ({ ctrl, onRebind }: SnesBindingsTabProps) => {
  const mappings = useMemo(() => buildDisplayMappings(ctrl.activeProfile), [ctrl.activeProfile]);
  return (
    <Box className="controls-settings__binding-list">
      <BindingListHeader middleLabel="SNES" />
      {mappings.map((mapping) => (
        <BindingRow
          key={`${mapping.button}-${mapping.mappingIndex}`}
          actionLabel={SNES_ACTION_LABELS[mapping.button]}
          middleLabel={SNES_BUTTON_LABELS[mapping.button]}
          middleIconId={SNES_ICON_IDS[mapping.button]}
          binding={mapping.binding}
          icon={mapping.icon}
          deviceIconSrc={bindingDeviceIcon(mapping.binding, mapping.sourceVid, mapping.sourcePid, ctrl.devices)}
          onRebind={() => onRebind(mapping.button)}
          onClear={() => ctrl.clearSnes(mapping.button, mapping.mappingIndex)}
        />
      ))}
    </Box>
  );
};

export { SnesBindingsTab };
