/* @layer shared-asset-extraction @kind types */
import type { PackTable } from '../pack.type';

interface DeclSink {
  tables: PackTable[];
  passthrough: { header: string; name: string }[];
}

export type { DeclSink };
