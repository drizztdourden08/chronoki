/* @layer shared-asset-extraction @kind logic */
import { RECIPE_DIR } from './recipe-store.constants';

const statePath = (name: string): string => `${RECIPE_DIR}/${name}.state`;

export { statePath };
