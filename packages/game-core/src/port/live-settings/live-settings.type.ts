/* @layer bridge-wasm @kind types */
interface LiveCalls {
  has: (name: string) => boolean;
  call: (name: string, ...args: number[]) => unknown;
}

interface LiveSettingsState {
  dimFlashes: boolean;
}

export type { LiveCalls, LiveSettingsState };
