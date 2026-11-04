/* @layer renderer-app @kind types */
import type { RefObject } from 'react';

interface SettingsEffectDeps {
  changedKeys: string[];
  restartToastShownRef: RefObject<boolean>;
}

export type { SettingsEffectDeps };
