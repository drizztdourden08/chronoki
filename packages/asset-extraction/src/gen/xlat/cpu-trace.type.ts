/* @layer shared-asset-extraction @kind types */

/** `ct.exe --cputrace <state> <frames> <out>` under the rule (CT_ORACLE_LOGICAL=1): the trace it writes, as text. */
interface CpuTraceRequest {
  state: Uint8Array;
  frames: number;
  /** CPUTRACE_UNIQUE, CPUTRACE_FROM, CPUTRACE_BTN, PEEK_POKE. */
  env: Record<string, string>;
}

/** What the xlat stages need of the oracle beyond PeekOracle; the WASM driver (P3) implements it next to it. */
interface CpuTraceOracle {
  cpuTrace: (request: CpuTraceRequest) => Promise<string>;
}

export type { CpuTraceOracle, CpuTraceRequest };
