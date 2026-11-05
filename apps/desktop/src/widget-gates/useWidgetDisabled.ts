/* @layer renderer-app @kind hook */
import { defineWidgetGates, useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';
import { isWidgetSettingOn } from './is-widget-setting-on';
import { settingTarget } from './setting-target';
import { VANILLA_SAFE_ID, WIDGET_GATE_MESSAGES, WIDGET_GATES } from './widget-gates.constants';

const useWidgetDisabled = defineWidgetGates<AppSettings>({
  gates: WIDGET_GATES,
  useSettings: () => useSettings<AppSettings>().settings,
  isOn: isWidgetSettingOn,
  gameDataBlockedBy: VANILLA_SAFE_ID,
  messageOf: (settingId) => WIDGET_GATE_MESSAGES[settingId],
  targetOf: settingTarget,
});

export { useWidgetDisabled };
