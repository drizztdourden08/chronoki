/* @layer shared-asset-extraction @kind logic */
import type { OracleDriver } from '../oracle/oracle-driver.type';
import type { ToolOracle } from '../oracle/oracle-capture.type';
import type { PeekDump } from '../oracle/peek.type';
import type { ImportContext } from '../pipeline/import-context.type';

const toolOracle = (ctx: ImportContext): ToolOracle => {
  const o = ctx.oracle as (OracleDriver & Partial<ToolOracle>) | null;
  if (o === null || typeof o.tool !== 'function') {
    throw new Error('this stage needs the oracle driver to implement tool (--sndtiming, --owforce, ...)');
  }
  return o as ToolOracle;
};

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

const rgbOfFb = (d: Uint8Array): Uint8Array => {
  const out = new Uint8Array(256 * 240 * 3);
  for (let y = 0; y < 240; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      const o = (2 * y * 512 + 2 * x) * 4;
      const i = (y * 256 + x) * 3;
      out[i] = d[o + 3] as number;
      out[i + 1] = d[o + 2] as number;
      out[i + 2] = d[o + 1] as number;
    }
  }
  return out;
};

const cgramOf = (peek: PeekDump): Uint8Array => peek.oam.slice(1056, 1056 + 512);

export { cgramOf, rgbOfFb, runTool, toolOracle };
