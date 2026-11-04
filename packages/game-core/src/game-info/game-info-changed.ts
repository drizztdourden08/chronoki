/* @layer bridge-wasm @kind logic */
import type { GameInfoSnapshot } from './game-info.type';
import { KEYS } from './game-info-changed.constants';

const gameInfoChanged = (
  prev: GameInfoSnapshot | null,
  next: GameInfoSnapshot,
): readonly (keyof GameInfoSnapshot)[] =>
  prev === null ? KEYS : KEYS.filter((key) => JSON.stringify(prev[key]) !== JSON.stringify(next[key]));

export { gameInfoChanged };
