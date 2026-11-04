/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import type { PeekOptions } from './require-tools.type';
import type { PeekResult } from './oracle-tools.type';
import { expandPadScript } from '../../recipes/expand-pad-script';
import { requireTools } from './require-tools';

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

export { peek };
