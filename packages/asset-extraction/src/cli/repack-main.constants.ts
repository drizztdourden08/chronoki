/* @layer shared-asset-extraction @kind constants */
import { NATIVE64_ABI, WASM32_ABI } from '../tables/table-abi.constants';
import type { TableAbi } from '../tables/table-abi.type';

const ABIS: Record<string, TableAbi> = { native64: NATIVE64_ABI, wasm32: WASM32_ABI };

const USAGE = 'usage: node packages/asset-extraction/src/cli/repack.ts --work <dir> --abi native64|wasm32 --out <dir>';

export { ABIS, USAGE };
