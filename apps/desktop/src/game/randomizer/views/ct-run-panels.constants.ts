/* @layer renderer-components @kind constants */
import type { RunPanelDef } from '@drizztdourden08/brock-randomizer';
import { CtPoolPanel } from './CtPoolPanel';
import { CtSettingsActions } from './CtSettingsActions';
import { CtSettingsPanel } from './CtSettingsPanel';

const CT_RUN_PANELS: readonly RunPanelDef[] = [
  { id: 'options-summary', title: 'Item pool', span: 1, Body: CtPoolPanel },
  { id: 'options-settings', title: 'Settings', span: 2, Body: CtSettingsPanel, actions: CtSettingsActions },
];

export { CT_RUN_PANELS };
