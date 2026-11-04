/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { SNES_BUTTON_LABELS } from '@chronoki/input-mapping';
import type { SnesButton } from '@chronoki/input-mapping';
import { BindingRow } from './BindingRow';
import { buildDisplayMappings } from './build-display-mappings';
import type { ControlsState } from './controls.type';

interface SnesBindingsTabProps {
  ctrl: ControlsState;
  onRebind: (button: SnesButton) => void;
}

const SnesBindingsTab = ({ ctrl, onRebind }: SnesBindingsTabProps) => {
  const mappings = useMemo(() => buildDisplayMappings(ctrl.activeProfile), [ctrl.activeProfile]);
  return (
    <Box className="controls-settings__bindings">
      {mappings.map((mapping) => (
        <BindingRow
          key={`${mapping.button}-${mapping.mappingIndex}`}
          actionLabel={SNES_BUTTON_LABELS[mapping.button]}
          binding={mapping.binding}
          icon={mapping.icon}
          onRebind={() => onRebind(mapping.button)}
          onClear={() => ctrl.clearSnes(mapping.button, mapping.mappingIndex)}
        />
      ))}
    </Box>
  );
};

export { SnesBindingsTab };
