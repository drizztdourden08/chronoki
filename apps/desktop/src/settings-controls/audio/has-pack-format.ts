/* @layer renderer-app @kind logic */
import type { AppSettings } from '@app/settings.type';

const hasPackFormat = (settings: AppSettings): boolean => settings.msuConfigMode === 'auto' || settings.enableMSU !== 'false';

export { hasPackFormat };
