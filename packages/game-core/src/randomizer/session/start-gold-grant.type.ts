/* @layer bridge-wasm @kind type */
type WramWrite = (offset: number, bytes: Uint8Array) => boolean;

type StartGoldGrant = {
  observe(started: boolean): boolean;
  granted(): boolean;
  reset(): void;
};

export type { StartGoldGrant, WramWrite };
