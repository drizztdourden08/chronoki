/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import { turboState } from '@app/game/turbo';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { HOST_PROBE_TURBO_FRAMES } from '../GameSession.constants';
import type { HostProbeEntry } from '@app/ipc/event-log-entry.type';
import { presentedFrames } from './presented-frames';
import { waitForFrames } from './wait-for-frames';

const keyEvent = (type: 'keydown' | 'keyup', code: string): void => {
  window.dispatchEvent(new KeyboardEvent(type, { code, key: code, bubbles: true, cancelable: true }));
};

const fastForwardCode = (): string | null => {
  const mapping = getInputManager().getFunctionMappings().find((entry) => entry.action === 'fast-forward');
  return mapping?.binding.type === 'keyboard' ? mapping.binding.code : null;
};

const probeHostTurbo = async (errors: string[]): Promise<HostProbeEntry['turbo']> => {
  const expected = hostGate('turbo');
  const code = fastForwardCode();
  if (code === null) errors.push('no key bound to fast-forward');
  const before = turboState.extraFrames;
  if (code !== null) keyEvent('keydown', code);
  await waitForFrames(presentedFrames() + HOST_PROBE_TURBO_FRAMES);
  const mutedDuring = turboState.muted;
  if (code !== null) keyEvent('keyup', code);
  await waitForFrames(presentedFrames() + 2);
  const extraFrames = turboState.extraFrames - before;
  const restored = !turboState.held && !turboState.muted;
  const good = expected ? extraFrames > 0 && mutedDuring && restored : extraFrames === 0 && !mutedDuring && restored;
  if (!good) errors.push('turbo did not match the gate');
  return { expected, extraFrames, mutedDuring, restored };
};

export { probeHostTurbo };
