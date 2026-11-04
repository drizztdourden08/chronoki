/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { toolOracle } from './capture-io';

const runTool = async (
  ctx: ImportContext,
  name: string,
  args: string[],
  outputs: string[],
  state: Uint8Array | null = null,
  inputs: Record<string, Uint8Array> = {},
): Promise<Record<string, Uint8Array>> => {
  const got = await toolOracle(ctx).tool({ args, state, inputs, outputs });
  if (!got[outputs[0] as string]) throw new Error(`${name}: ct.exe ${args[0]} wrote nothing`);
  return got;
};

export { runTool };
