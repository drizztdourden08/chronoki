/* @layer shared-asset-extraction @kind types */
import type { CType } from './c-type.type';

interface PackToken {
  kind: string;
  text: string;
}

/** A parsed initializer: a braced list, a string literal (its bytes, no NUL) or an integer expression. */
type InitNode =
  | { kind: 'list'; items: InitNode[] }
  | { kind: 'str'; bytes: Uint8Array }
  | { kind: 'expr'; tokens: PackToken[] };

/** Evaluates an integer constant expression over the headers' own #defines (pack_tables.py Expr.value). */
type ConstEval = (tokens: PackToken[], context: string) => bigint;

/** A generated table as the header parser hands it over (pack_tables.py Table). */
interface PackTable {
  name: string;
  ctype: CType;
  init: InitNode;
  header: string;
}

/** A numeric #define the pack carries (header, name, value). */
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
