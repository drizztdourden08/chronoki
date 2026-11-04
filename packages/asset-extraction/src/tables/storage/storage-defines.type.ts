/* @layer shared-asset-extraction @kind types */
import type { PackDefine } from '../pack.type';

type DefineCType = 'int' | 'unsigned';

interface RuntimeDefine extends PackDefine {
  ctype: DefineCType;
}

export type { DefineCType, RuntimeDefine };
