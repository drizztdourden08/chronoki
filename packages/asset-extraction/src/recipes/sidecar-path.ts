/* @layer shared-asset-extraction @kind logic */
import { RECIPE_DIR } from './recipe-store.constants';

const sidecarPath = (name: string, ext: string): string => `${RECIPE_DIR}/${name}.raw.${ext}`;

export { sidecarPath };
