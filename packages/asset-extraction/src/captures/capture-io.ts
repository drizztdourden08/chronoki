/* @layer shared-asset-extraction @kind logic */
import type { OracleCaptureDriver, PeekResult } from '../oracle/oracle-capture.type';
import type { ImportContext } from '../pipeline/import-context.type';
import { requireBytes } from '../pipeline/work-files';
import { expandPadScript } from '../recipes/expand-pad-script';
import { statePath } from '../recipes/recipe-store';

/** The oracle with its capture modes; a stop with a clear message when the driver lacks them. */
const captureDriver = (ctx: ImportContext): OracleCaptureDriver => {
  const o = ctx.oracle as Partial<OracleCaptureDriver> | null;
  if (o === null || typeof o.peek !== 'function' || typeof o.tool !== 'function') {
    throw new Error('the oracle driver has no peek / tool modes: the capture stages cannot run');
  }
  return o as OracleCaptureDriver;
};

/** ctgen.recipe(): the state the replay-recipes stage made for `name`. */
const recipeState = (ctx: ImportContext, name: string): Promise<Uint8Array> =>
  requireBytes(ctx.work, statePath(name));

interface PeekOptions {
  script?: string | null;
  frames?: number | null;
  env?: Record<string, string>;
  /** ctgen.peek's `rule`, default true. */
  rule?: boolean;
}

/** ctgen.peek(): a state read under the oracle; `script` takes the recipes' grammar. */
const peekState = (ctx: ImportContext, state: Uint8Array, o: PeekOptions = {}): Promise<PeekResult> =>
  captureDriver(ctx).peek({
    state,
    script: o.script === undefined || o.script === null ? null : expandPadScript(o.script),
    frames: o.frames ?? null,
    env: o.env ?? {},
    rule: o.rule ?? true,
  });

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

/** ctgen.cgram_of(): the 512-byte CGRAM of a peek (its .oam sidecar at 1056). */
const cgramOf = (peek: PeekResult): Uint8Array => peek.oam.slice(1056, 1056 + 512);

export { captureDriver, cgramOf, peekState, recipeState, rgbOfFb };
