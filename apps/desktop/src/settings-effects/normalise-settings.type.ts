/* @layer renderer-app @kind types */
import type { AppSettings } from '@app/settings.type';

type RawSettings = Partial<AppSettings> & { original?: boolean; widescreenAspect?: string };

export type { RawSettings };
