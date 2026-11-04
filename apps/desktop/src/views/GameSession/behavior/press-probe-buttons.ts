/* @layer renderer-appshell @kind logic */
import { isProbeInputStory } from '@app/launch-flags/is-probe-input-story';
import { INPUT_PROBE_BUTTONS, INPUT_PROBE_GAP_FRAMES, INPUT_PROBE_HOLD_FRAMES, INPUT_PROBE_STORY_BUTTONS } from '../GameSession.constants';
import { presentedFrames } from './presented-frames';
import { pressButton } from './press-button';
import { waitForFrames } from './wait-for-frames';

const pressProbeButtons = async (errors: string[]): Promise<void> => {
  for (const button of isProbeInputStory() ? INPUT_PROBE_STORY_BUTTONS : INPUT_PROBE_BUTTONS) {
    if (!(await pressButton(button, INPUT_PROBE_HOLD_FRAMES))) errors.push(`no key bound to ${button}`);
    await waitForFrames(presentedFrames() + INPUT_PROBE_GAP_FRAMES);
  }
};

export { pressProbeButtons };
