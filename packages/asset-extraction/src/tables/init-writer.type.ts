/* @layer shared-asset-extraction @kind types */
import type { CType } from './c-type.type';
import type { ConstEval, InitNode } from './pack.type';
import type { StringPool } from './string-pool.type';

interface WriterEnv {
  tableName: string;
  header: string;
  buf: Uint8Array;
  relocs: number[];
  pool: StringPool;
  evalConst: ConstEval;
}

interface FillArgs {
  t: CType;
  off: number;
  items: InitNode[];
  from: number;
  dry: boolean;
}

export type { FillArgs, WriterEnv };
