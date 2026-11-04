/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { FUNCTION_ACTION_LABELS } from '@chronoki/input-mapping';
import type { FunctionAction } from '@chronoki/input-mapping';
import { BindingRow } from './BindingRow';
import type { ControlsState } from './controls.type';

interface FunctionBindingsTabProps {
  ctrl: ControlsState;
  onRebind: (action: FunctionAction) => void;
}

const FunctionBindingsTab = ({ ctrl, onRebind }: FunctionBindingsTabProps) => (
  <Box className="controls-settings__bindings">
    {ctrl.functionMappings.map((mapping) => (
      <BindingRow
        key={mapping.action}
        actionLabel={FUNCTION_ACTION_LABELS[mapping.action]}
        binding={mapping.binding}
        icon={mapping.icon}
        onRebind={() => onRebind(mapping.action)}
        onClear={() => ctrl.clearFunction(mapping.action)}
      />
    ))}
  </Box>
);

export { FunctionBindingsTab };
