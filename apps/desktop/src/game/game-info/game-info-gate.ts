/* @layer bridge-wasm @kind logic */
import type { GateSignal } from '@drizztdourden08/brock-game-info';
import { hostGate, onHostGatesChange } from '@chronoki/game-core';
import { GAME_INFO_FEATURE, GAME_INFO_LOCKED_MESSAGE } from './game-info.constants';
import { lockedTarget } from './locked-target';

const gameInfoGate: GateSignal = {
  get: () => (hostGate(GAME_INFO_FEATURE) ? null : { message: GAME_INFO_LOCKED_MESSAGE, settingId: lockedTarget() }),
  subscribe: (fn) => onHostGatesChange(fn),
};

export { gameInfoGate };
