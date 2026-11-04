/* @layer bridge-wasm @kind logic */
import type { RandomizerWorldGame } from '@drizztdourden08/brock-randomizer/world';
import { createCtWorldGame } from '@chronoki/game-core';

const chronokiWorldStamp = createCtWorldGame({ checks: [] }) as unknown as RandomizerWorldGame;

export { chronokiWorldStamp };
