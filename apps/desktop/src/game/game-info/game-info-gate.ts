/* @layer bridge-wasm @kind logic */
import type { GateSignal } from '@drizztdourden08/brock-game-info';
import { hostGate, onHostGatesChange } from '@chronoki/game-core';
import { GAME_INFO_FEATURE, GAME_INFO_LOCKED_MESSAGE } from './game-info.constants';
import { lockedTarget } from './locked-target';
import type { GameInfoLock } from './game-info.type';

let locked: GameInfoLock | undefined;

const lockedState = (): GameInfoLock => {
  locked ??= { message: GAME_INFO_LOCKED_MESSAGE, settingId: lockedTarget() };
  return locked;
};

const gameInfoGate: GateSignal = {
  get: () => (hostGate(GAME_INFO_FEATURE) ? null : lockedState()),
  subscribe: (fn) => onHostGatesChange(fn),
};

export { gameInfoGate };
