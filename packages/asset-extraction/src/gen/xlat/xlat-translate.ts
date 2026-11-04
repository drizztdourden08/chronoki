/* @layer shared-asset-extraction @kind logic */
import { collectExecuted } from './xlat-collect';
import { emitProgram } from './xlat-emit';
import type { XlatInput } from './xlat-site.type';
import { extendStatically } from './xlat-static';

/** tools/gen/xlat.py: the traces' instructions plus the static extension, as the C source of src/xlat/<name>.c. */
const translate = (input: XlatInput): string => {
  const sites = collectExecuted(input);
  const tracedCount = sites.size;
  const staticCount = extendStatically(input, sites);
  return emitProgram(input.name, sites, input.stops, staticCount, tracedCount);
};

export { translate };
