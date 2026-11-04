/* @layer renderer-appshell @kind logic */
import { chronokiCore } from '@app/game/lifecycle';
import { FRAME_HEIGHT_EXPORT, FRAME_WIDTH_EXPORT } from '../GameSession.constants';

const FNV_OFFSET = 0x811c9dc5;

const FNV_PRIME = 0x01000193;

const frameHash = (): string => {
  const calls = chronokiCore.calls();
  if (!calls?.has('CkFramePtr')) return 'none';
  const length = calls.number(FRAME_WIDTH_EXPORT) * calls.number(FRAME_HEIGHT_EXPORT) * 4;
  const start = calls.number('CkFramePtr');
  const bytes = calls.heap().subarray(start, start + length);
  let hash = FNV_OFFSET;
  for (const byte of bytes) hash = Math.imul(hash ^ byte, FNV_PRIME);
  return (hash >>> 0).toString(16);
};

export { frameHash };
