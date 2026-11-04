/* @layer shared-asset-extraction @kind types */
import type { ConstEval, PackDefine, PackTable } from './pack.type';
import type { TableAbi } from './table-abi.type';

interface PackInput {
  tables: PackTable[];
  defines: PackDefine[];
  evalConst: ConstEval;
  abi: TableAbi;
}

export type { PackInput };
