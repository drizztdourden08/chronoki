/* @layer bridge-wasm @kind types */
interface CkViewCalls {
  has: (name: string) => boolean;
  number: (name: string) => number;
}

interface CkViewBlack {
  field: boolean;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface CkCanvasSize {
  width: number;
  height: number;
}

export type { CkCanvasSize, CkViewBlack, CkViewCalls };
