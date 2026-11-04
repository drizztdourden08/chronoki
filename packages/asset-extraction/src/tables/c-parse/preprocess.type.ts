/* @layer shared-asset-extraction @kind types */
import type { DefineMap } from './expr.type';

interface DefineLog {
  defines: DefineMap;
  order: { header: string; name: string }[];
}

export type { DefineLog };
