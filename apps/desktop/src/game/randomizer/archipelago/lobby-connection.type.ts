/* @layer bridge-wasm @kind type */
import type { LobbyCheck, LobbyDraft } from '@drizztdourden08/brock-randomizer/renderer';

type LobbyConnection = { lobby?: Pick<LobbyDraft, 'seat'>; lobbyCheck?: LobbyCheck };

export type { LobbyConnection };
