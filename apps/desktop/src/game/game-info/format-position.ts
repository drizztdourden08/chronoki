/* @layer bridge-wasm @kind logic */
import type { GameInfoEpoch } from '@chronoki/game-core';

const formatPoint = (x: number | null, y: number | null): string => (x === null || y === null ? 'Unknown' : `${x}, ${y}`);

const formatEpoch = (epoch: GameInfoEpoch | null): string =>
  epoch ? `${epoch.x}, ${epoch.y}${epoch.boarded ? ' (boarded)' : ''}` : 'Not available yet';

export { formatEpoch, formatPoint };
