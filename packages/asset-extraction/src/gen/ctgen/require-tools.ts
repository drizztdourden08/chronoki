/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import type { OracleTools } from './oracle-tools.type';

const requireTools = (ctx: ImportContext): OracleTools => {
  const oracle = ctx.oracle as Partial<OracleTools> | null;
  if (oracle === null || typeof oracle.peek !== 'function') throw new Error('the oracle with the capture tools is needed');
  return oracle as OracleTools;
};

export { requireTools };
