/* @layer bridge-wasm @kind types */
import type { CkDialogPacing } from '../dialog-pacing/dialog-pacing.type';

interface LiveCalls {
  has: (name: string) => boolean;
  call: (name: string, ...args: number[]) => unknown;
}

interface LiveSettingsState {
  dimFlashes: boolean;
  haptics: boolean;
  dialogPacing: CkDialogPacing;
}

export type { LiveCalls, LiveSettingsState };
