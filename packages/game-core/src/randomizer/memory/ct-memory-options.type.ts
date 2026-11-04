/* @layer bridge-wasm @kind type */
type CtMemoryOptions = {
  heap(): Uint8Array | null;
  wramPtr(): number;
  isLive(): boolean;
  onLoaded(cb: () => void): () => void;
};

export type { CtMemoryOptions };
