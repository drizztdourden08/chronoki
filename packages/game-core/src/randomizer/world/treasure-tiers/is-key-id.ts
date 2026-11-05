/* @layer bridge-wasm @kind logic */
import { KEY_IDS } from './key-ids.constants';

const isKeyId = (item: number): boolean => KEY_IDS.has(item);

export { isKeyId };
