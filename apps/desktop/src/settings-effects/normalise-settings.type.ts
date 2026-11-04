/* @layer renderer-app @kind types */
import type { AppSettings } from '@app/settings.type';

type RawSettings = Partial<AppSettings> & { original?: boolean };

export type { RawSettings };
