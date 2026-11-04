/* @layer shared-asset-extraction @kind types */
import type { TableAbi } from '../tables/table-abi.type';

interface RequiredImportArgs {
  rom: string;
  belthasar: string;
  out: string;
  abi: TableAbi;
}

export type { RequiredImportArgs };
