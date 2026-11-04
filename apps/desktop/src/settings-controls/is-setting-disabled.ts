/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { lockCauseOf } from './lock-cause-of';

const isSettingDisabled = (key: string, settings: AppSettings): boolean => lockCauseOf(key, settings) !== null;

export { isSettingDisabled };
