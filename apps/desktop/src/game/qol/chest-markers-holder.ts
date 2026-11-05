/* @layer bridge-wasm @kind state */
import type { ChestMarkers } from '@chronoki/game-core';

const chestMarkersHolder: { markers: ChestMarkers } = { markers: new Map() };

export { chestMarkersHolder };
