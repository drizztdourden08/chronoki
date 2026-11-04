/* @layer renderer-lib @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import type { AppSettings } from '@app/settings.type';

const useAllowDebugLogging = (): boolean => useSettings<AppSettings>().settings.allowDebugLogging;

export { useAllowDebugLogging };
