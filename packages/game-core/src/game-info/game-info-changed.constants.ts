/* @layer bridge-wasm @kind constants */
import type { GameInfoSnapshot } from './game-info.type';

const KEYS: readonly (keyof GameInfoSnapshot)[] = [
  'location', 'party', 'clock', 'gold', 'saveCount', 'story', 'inventory', 'techs', 'songField', 'songOverworld',
];

export { KEYS };
