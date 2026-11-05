/* @layer bridge-wasm @kind logic */
import { joinedRoll } from '@drizztdourden08/brock-randomizer';
import type { RandomizerProfileConfig, RollContext } from '@drizztdourden08/brock-randomizer';
import { joinFromForm } from '@drizztdourden08/brock-randomizer/renderer';
import type { LobbyCheck, LobbyDraft } from '@drizztdourden08/brock-randomizer/renderer';

const NO_LOBBY_ERROR = 'Check the lobby address before joining.';

type LobbyConnection = { lobby?: Pick<LobbyDraft, 'seat'>; lobbyCheck?: LobbyCheck };

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
