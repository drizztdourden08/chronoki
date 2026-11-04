/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { recipeState } from '../../oracle/recipe-state';

/** A recipe's cached state for a generator that only reads the state's bytes (no oracle run of its own). */
const peekOracleless = (ctx: ImportContext, name: string): Promise<Uint8Array> => recipeState(ctx, name);

export { peekOracleless };
