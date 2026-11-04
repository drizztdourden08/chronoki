/* @layer bridge-wasm @kind logic */
import type { GameInfoSnapshot } from './game-info.type';

const KEYS: readonly (keyof GameInfoSnapshot)[] = [
  'location', 'party', 'clock', 'gold', 'saveCount', 'story', 'inventory', 'techs', 'songField', 'songOverworld',
];

const gameInfoChanged = (
  prev: GameInfoSnapshot | null,
  next: GameInfoSnapshot,
): readonly (keyof GameInfoSnapshot)[] =>
  prev === null ? KEYS : KEYS.filter((key) => JSON.stringify(prev[key]) !== JSON.stringify(next[key]));

export { gameInfoChanged };
