/* @layer renderer-app @kind types */
import type { MutableRefObject } from 'react';

interface SettingsEffectDeps {
  changedKeys: string[];
  restartToastShownRef: MutableRefObject<boolean>;
}

export type { SettingsEffectDeps };
