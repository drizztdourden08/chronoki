/* @layer shared-asset-extraction @kind types */
interface PeekOptions {
  rule?: boolean;
  frames?: number | null;
  env?: Record<string, string>;
}

export type { PeekOptions };
