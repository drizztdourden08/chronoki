/* @layer bridge-wasm @kind logic */
import type { ActiveGame } from './active-game.type';

const activeGameHolder: { current: ActiveGame | null } = { current: null };

export { activeGameHolder };
