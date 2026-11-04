/* @layer renderer-appshell @kind logic */
import { isProbeInputStory } from '@app/launch-flags/is-probe-input-story';
import { probeInputPresses } from '@app/launch-flags/probe-input-presses';
import { INPUT_PROBE_BOOT_FRAMES, INPUT_PROBE_HASH_FRAME } from '../GameSession.constants';
import { frameHash } from './frame-hash';
import { logProbe } from './log-probe';
import { observeInputMask } from './observe-input-mask';
import { presentedFrames } from './presented-frames';
import { pressProbeButtons } from './press-probe-buttons';
import { waitForExactFrame } from './wait-for-exact-frame';
import { waitForFrames } from './wait-for-frames';

const runInputProbe = async (): Promise<void> => {
  const presses = probeInputPresses();
  await waitForFrames(INPUT_PROBE_BOOT_FRAMES);
  const observer = observeInputMask();
  const errors: string[] = [];
  if (presses) await pressProbeButtons(errors);
  const hashFrame = isProbeInputStory() ? presentedFrames() + 1 : INPUT_PROBE_HASH_FRAME;
  const frame = await waitForExactFrame(hashFrame);
  const hash = frameHash();
  observer.stop();
  const masks = observer.masks();
  const pressed = masks.some((mask) => mask !== 0);
  if (frame !== hashFrame) errors.push(`hashed at frame ${frame}, not ${hashFrame}`);
  if (presses && !pressed) errors.push('no non-zero mask reached CkSetInput');
  if (!presses && pressed) errors.push('a non-zero mask reached CkSetInput with no presses');
  await logProbe({ probe: 'input', ok: errors.length === 0, mode: presses ? 'press' : 'none', frame, hash, masks, errors });
};

export { runInputProbe };
