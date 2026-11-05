/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';
import { GATE_KEY_PREFIX } from './gate-keys.constants';

const isAspectRuleDisabled = (key: string, settings: AppSettings): boolean =>
  key === `${GATE_KEY_PREFIX}extendY` && settings.aspectRatio !== 'original';

export { isAspectRuleDisabled };
