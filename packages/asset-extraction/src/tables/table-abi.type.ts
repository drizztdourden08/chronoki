/* @layer shared-asset-extraction @kind types */
/**
 * The pointer width a table pack is laid out for: 8 bytes for the native64 reference comparison, 4 for the
 * wasm32 core. pack_tables.py hard-codes 8 (PTR_SIZE); here it is a parameter.
 */
interface TableAbi {
  name: 'wasm32' | 'native64';
  pointerSize: 4 | 8;
}

export type { TableAbi };
