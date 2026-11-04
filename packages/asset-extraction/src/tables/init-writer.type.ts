/* @layer shared-asset-extraction @kind types */
import type { ConstEval } from './pack.type';
import type { StringPool } from './string-pool.type';

interface WriterEnv {
  tableName: string;
  header: string;
  buf: Uint8Array;
  relocs: number[];
  pool: StringPool;
  evalConst: ConstEval;
}

export type { WriterEnv };
