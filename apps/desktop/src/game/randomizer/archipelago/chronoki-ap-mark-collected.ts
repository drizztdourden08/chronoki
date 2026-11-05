/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import { chronokiApCollectedSet } from './chronoki-ap-collected-set';

const chronokiApMarkCollected: NonNullable<ArchipelagoGame<unknown, unknown>['markCollected']> = (keys) => {
  keys.forEach((key) => chronokiApCollectedSet.add(key));
};

export { chronokiApMarkCollected };
