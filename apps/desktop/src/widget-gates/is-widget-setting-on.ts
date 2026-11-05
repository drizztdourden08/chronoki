/* @layer renderer-app @kind logic */
import { effectiveGatesOf } from '@app/settings-controls/effective-gates-of';
import type { AppSettings } from '@app/settings.type';
import { VANILLA_SAFE_ID } from './widget-gates.constants';

const isWidgetSettingOn = (settings: AppSettings, settingId: string): boolean =>
  settingId === VANILLA_SAFE_ID ? settings.vanillaSafe : effectiveGatesOf(settings).has(settingId);

export { isWidgetSettingOn };
