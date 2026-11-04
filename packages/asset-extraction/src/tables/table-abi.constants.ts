/* @layer shared-asset-extraction @kind constants */
import type { TableAbi } from './table-abi.type';

/** The reference comparison: Belthasar's own x86-64 setup (8-byte pointers). */
const NATIVE64_ABI: TableAbi = { name: 'native64', pointerSize: 8 };
/** The ChronoKi core, built for wasm32 (4-byte pointers). */
const WASM32_ABI: TableAbi = { name: 'wasm32', pointerSize: 4 };

export { NATIVE64_ABI, WASM32_ABI };
