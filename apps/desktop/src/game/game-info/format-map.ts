/* @layer bridge-wasm @kind logic */
import { MAP_ID_WIDTH } from './game-info.constants';

const formatMap = (id: number, name?: string): string =>
  name || `Map 0x${id.toString(16).toUpperCase().padStart(MAP_ID_WIDTH, '0')}`;

export { formatMap };
