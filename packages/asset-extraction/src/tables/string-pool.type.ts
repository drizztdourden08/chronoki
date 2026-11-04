/* @layer shared-asset-extraction @kind types */
interface StringPool {
  add: (text: Uint8Array) => number;
  bytes: () => Uint8Array;
}

export type { StringPool };
