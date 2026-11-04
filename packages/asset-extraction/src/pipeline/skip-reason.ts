/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from './import-context.type';
import type { ImportStage } from './stage.type';

const skipReason = (s: ImportStage, ctx: ImportContext): string | null => {
  if (s.run === null) return `not ported yet (${s.python})`;
  if (s.needs.includes('oracle') && ctx.oracle === null) return 'needs the oracle';
  return null;
};

export { skipReason };
