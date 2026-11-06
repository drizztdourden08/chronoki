/* @layer bridge-wasm @kind logic */
import { joinedRoll } from '@drizztdourden08/brock-randomizer';
import type { RandomizerProfileConfig, RollContext } from '@drizztdourden08/brock-randomizer';
import { joinFromForm } from '@drizztdourden08/brock-randomizer/renderer';
import type { LobbyConnection } from './lobby-connection.type';
import { NO_LOBBY_ERROR } from './chronoki-roll-archipelia.constants';

const rollChronokiArchipelia = async (config: RandomizerProfileConfig, ctx: RollContext) => {
  const { lobby, lobbyCheck } = (ctx.connection ?? {}) as LobbyConnection;
  if (lobbyCheck?.kind !== 'ok') throw new Error(NO_LOBBY_ERROR);
  ctx.onProgress?.(0);
  const joined = await joinFromForm(lobbyCheck, config, {
    wanted: lobby?.seat ?? null,
    onProgress: (fraction) => ctx.onProgress?.(fraction),
  });
  if (!joined.ok) throw new Error(joined.error);
  return joinedRoll(joined);
};

export { rollChronokiArchipelia };
