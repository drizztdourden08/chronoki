/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { recipeState } from '../../oracle/peek-access';

const peekOracleless = (ctx: ImportContext, name: string): Promise<Uint8Array> => recipeState(ctx, name);

export { peekOracleless };
