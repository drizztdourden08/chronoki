/* @layer shared-asset-extraction @kind logic */
import { RECIPE_DIR } from './recipe-store.constants';

const keyPath = (name: string): string => `${RECIPE_DIR}/${name}.key`;

export { keyPath };
