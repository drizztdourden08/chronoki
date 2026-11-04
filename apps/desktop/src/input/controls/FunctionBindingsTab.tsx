/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { InputGlyph } from '@app/compounds/InputGlyph';
import { FUNCTION_ACTION_LABELS } from '@chronoki/input-mapping';
import type { FunctionMapping } from '@chronoki/input-mapping';
import { BindingListHeader } from './BindingListHeader';
import { BindingRow } from './BindingRow';
import { bindingDeviceIcon } from './binding-device-icon';
import { SHORTCUT_ACTIONS } from './controls.constants';
import type { FunctionBindingsTabProps } from './FunctionBindingsTab.type';

const FunctionBindingsTab = ({ ctrl, onRebind }: FunctionBindingsTabProps) => {
  const ordered = useMemo(
    () => SHORTCUT_ACTIONS.flatMap((action) => ctrl.functionMappings.filter((m: FunctionMapping) => m.action === action)),
    [ctrl.functionMappings],
  );
  return (
    <Box className="controls-settings__bindings">
      <Box className="controls-settings__section-header">Keyboard Shortcuts</Box>
      <Box className="controls-settings__binding-list">
        <BindingListHeader />
        <Box className="binding-row binding-row--reserved" title="Reserved, cannot be rebound">
          <Text className="binding-row__action-label">Open Menu</Text>
          <Box className="binding-row__rest">
            <Box className="binding-row__icon-slot" />
            <Text className="binding-row__snes-label" />
            <Box className="binding-row__icon-slot">
              <InputGlyph iconId="kb-escape" label="Esc" showLabel={false} />
            </Box>
            <Text className="binding-row__binding-label">Esc</Text>
          </Box>
        </Box>
        {ordered.map((mapping) => (
          <BindingRow
            key={mapping.action}
            actionLabel={FUNCTION_ACTION_LABELS[mapping.action]}
            binding={mapping.binding}
            icon={mapping.icon}
            deviceIconSrc={bindingDeviceIcon(mapping,ctrl.devices, ctrl.activeProfile)}
            onRebind={() => onRebind(mapping.action)}
            onClear={() => ctrl.clearFunction(mapping.action)}
          />
        ))}
      </Box>
    </Box>
  );
};

export { FunctionBindingsTab };
