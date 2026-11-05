/* @layer bridge-wasm @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { startHaptics } from '@app/input/haptic-bridge/start-haptics';
import { startAutoSave } from '../auto-save/start-auto-save';
import { startSramSync } from '../sram-sync';
import { startTurboLoop } from '../turbo/start-turbo-loop';
import type { ActiveGame } from './active-game.type';
import { chronokiCore } from './chronoki-core';
import { saveOnQuit } from './save-on-quit';

const startSessionServices = (game: Pick<ActiveGame, 'store' | 'profileId'>): (() => void) => {
  const { device } = getPlatform();
  if (game.profileId) startSramSync(chronokiCore, game.store.sram, game.profileId);
  device.keepAwake();
  const unsubscribe = device.onAppPause(() => { void saveOnQuit(); });
  const stopAutoSave = startAutoSave();
  const stopTurbo = startTurboLoop();
  const stopHaptics = startHaptics();
  return () => {
    stopAutoSave();
    stopTurbo();
    stopHaptics();
    unsubscribe();
    device.allowSleep();
  };
};

export { startSessionServices };
