/* @layer shared-asset-extraction @kind logic */
import type { OracleDriver } from '../oracle/oracle-driver.type';
import type { ToolOracle } from '../oracle/oracle-capture.type';
import type { ImportContext } from '../pipeline/import-context.type';

const toolOracle = (ctx: ImportContext): ToolOracle => {
  const o = ctx.oracle as (OracleDriver & Partial<ToolOracle>) | null;
  if (o === null || typeof o.tool !== 'function') {
    throw new Error('this stage needs the oracle driver to implement tool (--sndtiming, --owforce, ...)');
  }
  return o as ToolOracle;
};

export { toolOracle };
