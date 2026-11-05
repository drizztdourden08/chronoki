/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';

const collected = new Set<string>();

const chronokiApMarkCollected: NonNullable<ArchipelagoGame<unknown, unknown>['markCollected']> = (keys) => {
  keys.forEach((key) => collected.add(key));
};

const chronokiApCollected = (): ReadonlySet<string> => collected;

export { chronokiApCollected, chronokiApMarkCollected };
