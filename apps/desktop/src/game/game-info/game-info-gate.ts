/* @layer bridge-wasm @kind logic */
import type { GateSignal } from '@drizztdourden08/brock-game-info';
import { hostGate, onHostGatesChange } from '@chronoki/game-core';
import { settingTarget } from '@app/widget-gates/setting-target';
import { WIDGET_GATE_MESSAGES } from '@app/widget-gates/widget-gates.constants';
import { GAME_INFO_FEATURE } from './game-info.constants';
import type { GameInfoLock } from './game-info.type';

let locked: GameInfoLock | undefined;

const lockedState = (): GameInfoLock => {
  locked ??= { message: WIDGET_GATE_MESSAGES[GAME_INFO_FEATURE] ?? '', settingId: settingTarget(GAME_INFO_FEATURE) };
  return locked;
};

const gameInfoGate: GateSignal = {
  get: () => (hostGate(GAME_INFO_FEATURE) ? null : lockedState()),
  subscribe: (fn) => onHostGatesChange(fn),
};

export { gameInfoGate };
