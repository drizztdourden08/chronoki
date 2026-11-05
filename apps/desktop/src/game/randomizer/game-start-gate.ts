/* @layer bridge-wasm @kind logic */
import { createGameStartWatch } from '@chronoki/game-core';

const gameStartGate = createGameStartWatch();

export { gameStartGate };
