/* @layer bridge-wasm @kind logic */
import type { ArchipelagoGame } from '@drizztdourden08/brock-randomizer';
import { chronokiCore } from '../../lifecycle/chronoki-core';
import { gameStartGate } from '../game-start-gate';
import { onAnyLoad } from '../on-any-load';

const chronokiApFile: NonNullable<ArchipelagoGame<unknown, unknown>['file']> = {
  inPlay: () => chronokiCore.state().status === 'running' && gameStartGate.started(),
  onSwap: onAnyLoad,
};

export { chronokiApFile };
