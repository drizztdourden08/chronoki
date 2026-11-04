/* @layer shared-asset-extraction @kind types */
import type { CType } from '../c-type.type';
import type { ConstEval, PackDefine, PackTable } from '../pack.type';
import type { DeclSink } from './declaration.type';
import type { DefineMap } from './expr.type';

interface Headers {
  tables: PackTable[];
  passthrough: DeclSink['passthrough'];
  evalConst: ConstEval;
  defines: DefineMap;
  typedefs: Map<string, CType>;
  texts: Map<string, string>;
  parseFile: (bytes: Uint8Array, header: string) => void;
  numericDefines: () => PackDefine[];
}

export type { Headers };
