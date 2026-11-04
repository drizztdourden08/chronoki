/* @layer shared-asset-extraction @kind types */
interface PeekArgs {
  state: Uint8Array;
  script: string | null;
  env?: Record<string, string>;
  rule?: boolean;
  frames?: number | null;
  save?: boolean;
}

export type { PeekArgs };
