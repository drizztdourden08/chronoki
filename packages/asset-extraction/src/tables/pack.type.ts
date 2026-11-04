/* @layer shared-asset-extraction @kind types */
import type { CType } from './c-type.type';

interface PackToken {
  kind: string;
  text: string;
}

type InitNode =
  | { kind: 'list'; items: InitNode[] }
  | { kind: 'str'; bytes: Uint8Array }
  | { kind: 'expr'; tokens: PackToken[] };

type ConstEval = (tokens: PackToken[], context: string) => bigint;

interface PackTable {
  name: string;
  ctype: CType;
  init: InitNode;
  header: string;
  anon: boolean;
}

interface PackDefine {
  header: string;
  name: string;
  value: bigint;
}

interface BuiltTable {
  table: PackTable;
  data: Uint8Array;
  relocs: number[];
}

export type { BuiltTable, ConstEval, InitNode, PackDefine, PackTable, PackToken };
