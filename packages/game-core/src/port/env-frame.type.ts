/* @layer bridge-wasm @kind types */
interface CkEnvCalls {
  has: (name: string) => boolean;
  number: (name: string, ...args: number[]) => number;
  call: (name: string, ...args: number[]) => unknown;
  heap: () => Uint8Array | null;
}

interface CkEnvFrame {
  data: Uint8Array;
  width: number;
  height: number;
}

export type { CkEnvCalls, CkEnvFrame };
