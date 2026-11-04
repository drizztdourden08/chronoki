/* @layer shared-asset-extraction @kind types */

/** One ct.exe run: `callMain(argv)` on a fresh module, with these files staged in MEMFS first. */
interface CtInvocation {
  argv: string[];
  env: Record<string, string>;
  /** MEMFS path -> bytes written before the run. */
  files: Record<string, Uint8Array>;
  /** MEMFS paths read back after the run (the ones that exist). */
  outputs: string[];
}

interface CtOutcome {
  status: number;
  stdout: string[];
  stderr: string[];
  /** MEMFS path -> bytes, for the outputs that exist. */
  files: Record<string, Uint8Array>;
}

export type { CtInvocation, CtOutcome };
