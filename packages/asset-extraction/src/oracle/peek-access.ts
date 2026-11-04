/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import type { PeekOracle } from './peek.type';

const peekOracle = (ctx: ImportContext): PeekOracle => {
  const driver: (typeof ctx.oracle & Partial<PeekOracle>) | null = ctx.oracle;
  if (!driver) throw new Error('this stage needs the oracle: none was given');
  if (!driver.peek || !driver.peekShots || !driver.monitor) {
    throw new Error('this stage needs the oracle driver to implement peek, peekShots and monitor');
  }
  return driver as PeekOracle;
};

export { peekOracle };
