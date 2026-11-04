/* @layer shared-asset-extraction @kind constants */
import type { TableAbi } from './table-abi.type';

const NATIVE64_ABI: TableAbi = { name: 'native64', pointerSize: 8 };
const WASM32_ABI: TableAbi = { name: 'wasm32', pointerSize: 4 };

export { NATIVE64_ABI, WASM32_ABI };
