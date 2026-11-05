/* @layer renderer-components @kind component */
import { StatTiles } from '@drizztdourden08/brock-randomizer/renderer';
import type { RunPanelProps } from '@drizztdourden08/brock-randomizer';
import { ctSettingsTilesOf } from './ct-settings-tiles-of';
import { ctValuesOf } from './ct-values-of';

const CtSettingsPanel = ({ config }: RunPanelProps) => <StatTiles tiles={ctSettingsTilesOf(ctValuesOf(config.options))} />;

export { CtSettingsPanel };
