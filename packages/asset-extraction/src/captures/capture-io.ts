/* @layer shared-asset-extraction @kind logic */
import type { OracleDriver } from '../oracle/oracle-driver.type';
import type { ToolOracle } from '../oracle/oracle-capture.type';
import type { PeekDump } from '../oracle/peek.type';
import type { ImportContext } from '../pipeline/import-context.type';

/** The oracle with ct.exe's tool modes; a stop with a clear message when the driver lacks them. */
const toolOracle = (ctx: ImportContext): ToolOracle => {
  const o = ctx.oracle as (OracleDriver & Partial<ToolOracle>) | null;
  if (o === null || typeof o.tool !== 'function') {
    throw new Error('this stage needs the oracle driver to implement tool (--sndtiming, --owforce, ...)');
  }
  return o as ToolOracle;
};

/** Runs one tool mode and returns its outputs; a stop naming the stage when the first output was not written. */
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

/** ctgen.rgb_of_fb(): the 256x240 RGB picture of a 512x480 [pad,B,G,R] framebuffer dump (2x doubled). */
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

/** ctgen.cgram_of(): the 512-byte CGRAM of a peek (its oam dump at 1056). */
const cgramOf = (peek: PeekDump): Uint8Array => peek.oam.slice(1056, 1056 + 512);

export { cgramOf, rgbOfFb, runTool, toolOracle };
