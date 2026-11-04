/* @layer shared-asset-extraction @kind logic */
import type { CPointer } from './c-type.type';
import type { TableAbi } from './table-abi.type';

const makePointer = (abi: TableAbi): CPointer => ({ tag: 'pointer', size: abi.pointerSize, align: abi.pointerSize });

export { makePointer };
