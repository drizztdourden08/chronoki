/* @layer bridge-wasm @kind types */
interface CkEnvCalls {
  has: (name: string) => boolean;
  number: (name: string, ...args: number[]) => number;
  call: (name: string, ...args: number[]) => unknown;
  heap: () => Uint8Array | null;
}

/* the shown field frame without sprites, captions or boxes: RGBA, the 1x picture (CkViewWidth x CkViewHeight) */
interface CkEnvFrame {
  data: Uint8Array;
  width: number;
  height: number;
}

export type { CkEnvCalls, CkEnvFrame };
