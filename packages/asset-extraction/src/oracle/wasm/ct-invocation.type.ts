/* @layer shared-asset-extraction @kind types */

interface CtInvocation {
  argv: string[];
  env: Record<string, string>;
  files: Record<string, Uint8Array>;
  outputs: string[];
}

interface CtOutcome {
  status: number;
  stdout: string[];
  stderr: string[];
  files: Record<string, Uint8Array>;
}

export type { CtInvocation, CtOutcome };
