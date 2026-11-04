/* @layer bridge-wasm @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { startSramSync } from '../sram-sync';
import type { ActiveGame } from './active-game.type';
import { chronokiCore } from './chronoki-core';
import { saveOnQuit } from './save-on-quit';

const startSessionServices = (game: Pick<ActiveGame, 'store' | 'profileId'>): (() => void) => {
  const { device } = getPlatform();
  if (game.profileId) startSramSync(chronokiCore, game.store.sram, game.profileId);
  device.keepAwake();
  const unsubscribe = device.onAppPause(() => { void saveOnQuit(); });
  return () => {
    unsubscribe();
    device.allowSleep();
  };
};

export { startSessionServices };
