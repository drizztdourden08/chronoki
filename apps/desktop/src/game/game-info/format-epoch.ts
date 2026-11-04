/* @layer bridge-wasm @kind logic */
import type { GameInfoEpoch } from '@chronoki/game-core';

const formatEpoch = (epoch: GameInfoEpoch | null): string =>
  epoch ? `${epoch.x}, ${epoch.y}${epoch.boarded ? ' (boarded)' : ''}` : 'Not available yet';

export { formatEpoch };
