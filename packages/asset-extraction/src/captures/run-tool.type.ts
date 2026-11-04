/* @layer shared-asset-extraction @kind types */
interface ToolRun {
  name: string;
  args: string[];
  outputs: string[];
  state?: Uint8Array | null;
  inputs?: Record<string, Uint8Array>;
}

export type { ToolRun };
