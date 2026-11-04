/* @layer shared-asset-extraction @kind types */

interface CpuTraceRequest {
  state: Uint8Array;
  frames: number;
  env: Record<string, string>;
}

interface CpuTraceOracle {
  cpuTrace: (request: CpuTraceRequest) => Promise<string>;
}

export type { CpuTraceOracle, CpuTraceRequest };
