/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { toolOracle } from './capture-io';
import type { ToolRun } from './run-tool.type';

const runTool = async (
  ctx: ImportContext,
  { name, args, outputs, state = null, inputs = {} }: ToolRun,
): Promise<Record<string, Uint8Array>> => {
  const got = await toolOracle(ctx).tool({ args, state, inputs, outputs });
  if (!got[outputs[0] as string]) throw new Error(`${name}: ct.exe ${args[0]} wrote nothing`);
  return got;
};

export { runTool };
