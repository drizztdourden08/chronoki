/* @layer bridge-wasm @kind logic */
import { encodeSaveSlot } from '@drizztdourden08/brock-port-kit';
import { appLog } from '@app/log/app-log';
import type { ActiveGame } from './active-game.type';
import { chronokiCore } from './chronoki-core';
import { RESCUE_STATE_NAME } from './replan-game.constants';

const rescueState = async (game: ActiveGame, state: Uint8Array): Promise<void> => {
  if (!game.profileId) return;
  const meta = { port: chronokiCore.definition.id, savedAt: Date.now(), rom: game.romFile };
  try {
    await game.store.named.create(game.profileId, 'auto', `${RESCUE_STATE_NAME} ${new Date().toISOString()}`, { bytes: encodeSaveSlot({ meta, state }) });
  } catch (err) {
    appLog.error('[replan] Could not keep the state as an auto save', err);
  }
};

export { rescueState };
