/* @layer shared-asset-extraction @kind types */
interface TableAbi {
  name: 'wasm32' | 'native64';
  pointerSize: 4 | 8;
}

export type { TableAbi };
