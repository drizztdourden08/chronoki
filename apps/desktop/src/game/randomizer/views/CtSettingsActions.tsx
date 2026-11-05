/* @layer renderer-components @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { RunPanelProps } from '@drizztdourden08/brock-randomizer';
import { OPTIONS_PAGE, SHOW_ALL_LABEL } from './ct-settings.constants';

const CtSettingsActions = ({ open }: RunPanelProps) => (
  <Button variant="secondary" size="sm" onClick={() => open(OPTIONS_PAGE)}>{SHOW_ALL_LABEL}</Button>
);

export { CtSettingsActions };
