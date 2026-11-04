/* @layer renderer-appshell @kind logic */
import { chronokiCore } from '@app/game/lifecycle';
import { FRAME_COUNT_EXPORT } from '../GameSession.constants';

const presentedFrames = (): number => {
  const calls = chronokiCore.calls();
  return calls?.has(FRAME_COUNT_EXPORT) ? calls.number(FRAME_COUNT_EXPORT) : 0;
};

export { presentedFrames };
