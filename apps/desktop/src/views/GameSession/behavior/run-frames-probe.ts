/* @layer renderer-appshell @kind logic */
import { CHRONOKI_VIDEO } from '@chronoki/game-core';
import { chronokiCore } from '@app/game/lifecycle';
import { FRAME_HEIGHT_EXPORT, FRAME_WIDTH_EXPORT } from '../GameSession.constants';
import { audioFrameTotal } from './audio-frame-total';
import { logProbe } from './log-probe';
import { presentedFrames } from './presented-frames';
import { waitForFrames } from './wait-for-frames';

const sizeOf = (): { width: number; height: number } => {
  const calls = chronokiCore.calls();
  if (!calls?.has(FRAME_WIDTH_EXPORT)) return { width: 0, height: 0 };
  return { width: calls.number(FRAME_WIDTH_EXPORT), height: calls.number(FRAME_HEIGHT_EXPORT) };
};

const runFramesProbe = async (target: number): Promise<void> => {
  const outcome = await waitForFrames(target);
  const { width, height } = sizeOf();
  const { status, error } = chronokiCore.state();
  const errors: string[] = [];
  if (outcome !== 'reached') errors.push(`frames: ${outcome}`);
  if (error) errors.push(error);
  if (width !== CHRONOKI_VIDEO.width || height !== CHRONOKI_VIDEO.height) errors.push(`frame size ${width}x${height}`);
  await logProbe({
    probe: 'frames', presented: presentedFrames(), width, height, audioFrames: audioFrameTotal(), coreStatus: status, errors,
  });
};

export { runFramesProbe };
