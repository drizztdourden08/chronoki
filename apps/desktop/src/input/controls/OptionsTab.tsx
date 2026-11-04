/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { buildRequiredInputs } from './build-required-inputs';
import { requiredInputRows } from './required-input-rows';
import type { CtrlProps } from './controls.type';

const OptionsTab = ({ ctrl }: CtrlProps) => {
  const rows = useMemo(
    () => requiredInputRows(buildRequiredInputs(ctrl.activeProfile, ctrl.devices)),
    [ctrl.activeProfile, ctrl.devices],
  );
  return <SettingsSection id="controls-required-inputs" title="Required inputs" rows={rows} />;
};

export { OptionsTab };
