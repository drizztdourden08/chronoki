/* @layer shared-asset-extraction @kind types */
interface StepCall {
  args: string[];
  env: Record<string, string>;
  needsState: boolean;
}

export type { StepCall };
