/* @layer bridge-wasm @kind logic */
import type { ActiveGame } from './active-game.type';
import { bootWithState } from './boot-with-state';
import { haltGame } from './halt-game';
import type { ReplanOutcome, ReplanRequest } from './replan-game.type';
import { rescueState } from './rescue-state';

const rebootInto = async (base: ActiveGame, { from, to }: Pick<ReplanRequest, 'from' | 'to'>, state: Uint8Array): Promise<ReplanOutcome> => {
  const next = await bootWithState(base, to, state);
  if (next?.loaded) return { kind: 'done', plan: to };
  if (next) await haltGame(next.game);
  const back = await bootWithState(base, from, state);
  if (back?.loaded) return { kind: 'reverted', plan: from };
  await rescueState(base, state);
  return back ? { kind: 'rescued', plan: from } : { kind: 'lost' };
};

export { rebootInto };
