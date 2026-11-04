/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { requireBytes } from '../../pipeline/work-files';
import { statePath } from '../../recipes/recipe-store';

const recipeState = (ctx: ImportContext, name: string): Promise<Uint8Array> => requireBytes(ctx.work, statePath(name));

export { recipeState };
