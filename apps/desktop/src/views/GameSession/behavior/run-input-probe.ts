/* @layer renderer-appshell @kind logic */
import {
  INPUT_PROBE_BOOT_FRAMES, INPUT_PROBE_BUTTONS, INPUT_PROBE_GAP_FRAMES, INPUT_PROBE_HOLD_FRAMES, INPUT_PROBE_SETTLE_FRAMES,
  INPUT_PROBE_STATIC_FRAMES,
} from '../GameSession.constants';
import { frameHash } from './frame-hash';
import { logProbe } from './log-probe';
import { observeInputMask } from './observe-input-mask';
import { presentedFrames } from './presented-frames';
import { pressButton } from './press-button';
import { waitForFrames } from './wait-for-frames';

const runInputProbe = async (): Promise<void> => {
  await waitForFrames(INPUT_PROBE_BOOT_FRAMES);
  const observer = observeInputMask();
  const first = frameHash();
  await waitForFrames(presentedFrames() + INPUT_PROBE_STATIC_FRAMES);
  const before = frameHash();
  const errors: string[] = [];
  for (const button of INPUT_PROBE_BUTTONS) {
    if (!(await pressButton(button, INPUT_PROBE_HOLD_FRAMES))) errors.push(`no key bound to ${button}`);
    await waitForFrames(presentedFrames() + INPUT_PROBE_GAP_FRAMES);
  }
  await waitForFrames(presentedFrames() + INPUT_PROBE_SETTLE_FRAMES);
  const after = frameHash();
  observer.stop();
  const masks = observer.masks();
  if (!masks.some((mask) => mask !== 0)) errors.push('no non-zero mask reached CkSetInput');
  if (after === before) errors.push('screen did not change after input');
  await logProbe({
    probe: 'input', ok: errors.length === 0, buttons: INPUT_PROBE_BUTTONS, masks, screenStatic: first === before, before, after, errors,
  });
};

export { runInputProbe };
