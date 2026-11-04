/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { requireBytes } from '../../pipeline/require-bytes';
import { expandPadScript } from '../../recipes/expand-pad-script';
import { statePath } from '../../recipes/recipe-store';
import type { OracleTools, PeekResult } from './oracle-tools.type';

const CTLS_HEADER = 16;
const WRAM_AT = 69;
const WRAM_BYTES = 0x20000;
const CGRAM_AT = 1056;

/** The oracle with the capture tools, or a clear stop (ctgen.py: ct.exe is missing). */
const requireTools = (ctx: ImportContext): OracleTools => {
  const oracle = ctx.oracle as Partial<OracleTools> | null;
  if (oracle === null || typeof oracle.peek !== 'function') throw new Error('the oracle with the capture tools is needed');
  return oracle as OracleTools;
};

/** ctgen.recipe(name): the state the replay-recipes stage cached. */
const recipeState = (ctx: ImportContext, name: string): Promise<Uint8Array> => requireBytes(ctx.work, statePath(name));

/** recipes.wram_of(): the 128 KB of WRAM inside a CTLS state. */
const wramOfState = (state: Uint8Array): Uint8Array => {
  const isCtls = String.fromCharCode(...state.subarray(0, 4)) === 'CTLS';
  const payload = state.subarray(isCtls ? CTLS_HEADER : 0);
  return payload.subarray(WRAM_AT, WRAM_AT + WRAM_BYTES);
};

interface PeekOptions {
  rule?: boolean;
  frames?: number | null;
  env?: Record<string, string>;
}

/** ctgen.peek(): the recipes' pad grammar (`(a:n,b:m)*K` groups), the rule on unless told otherwise. */
const peek = (
  ctx: ImportContext,
  state: Uint8Array,
  script: string | null,
  options: PeekOptions = {},
): Promise<PeekResult> =>
  requireTools(ctx).peek({
    state,
    script: script === null ? null : expandPadScript(script),
    rule: options.rule ?? true,
    frames: options.frames ?? null,
    env: options.env ?? {},
  });

/** ctgen.cgram_of(): the 512-byte CGRAM of a peek. */
const cgramOf = (peeked: PeekResult): Uint8Array => peeked.oam.subarray(CGRAM_AT, CGRAM_AT + 512);

/** ctgen.rgb_of_fb(): the 256x240 RGB picture of a framebuffer dump (512x480 [pad,B,G,R], doubled). */
const rgbOfFb = (fb: Uint8Array): Uint8Array => {
  const out = new Uint8Array(256 * 240 * 3);
  for (let y = 0; y < 240; y += 1) {
    for (let x = 0; x < 256; x += 1) {
      const o = (2 * y * 512 + 2 * x) * 4;
      const i = (y * 256 + x) * 3;
      out[i] = fb[o + 3] as number;
      out[i + 1] = fb[o + 2] as number;
      out[i + 2] = fb[o + 1] as number;
    }
  }
  return out;
};

export { cgramOf, peek, recipeState, requireTools, rgbOfFb, wramOfState };
