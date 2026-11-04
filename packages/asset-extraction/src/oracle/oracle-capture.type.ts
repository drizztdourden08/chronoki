/* @layer shared-asset-extraction @kind types */

interface ToolRequest {
  args: string[];
  state: Uint8Array | null;
  inputs: Record<string, Uint8Array>;
  outputs: string[];
}

interface ToolOracle {
  tool: (request: ToolRequest) => Promise<Record<string, Uint8Array>>;
}

export type { ToolOracle, ToolRequest };
