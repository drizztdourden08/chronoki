/* @layer shared-asset-extraction @kind types */
import type { CType } from '../c-type.type';
import type { ConstEval } from '../pack.type';
import type { TableAbi } from '../table-abi.type';
import type { TokenCursor } from './token-cursor.type';

interface ParseEnv {
  cur: TokenCursor;
  header: string;
  abi: TableAbi;
  typedefs: Map<string, CType>;
  evalConst: ConstEval;
}

export type { ParseEnv };
