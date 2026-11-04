/* @layer renderer-appshell @kind logic */
import type { AudioAdapter } from '@drizztdourden08/brock-port-kit/renderer';
import { totals } from './audio-frame-totals';

const attachAudioFrameCounter = (adapter: AudioAdapter): void => {
  totals.frames = 0;
  const push = adapter.pushSamples.bind(adapter);
  adapter.pushSamples = (block) => {
    totals.frames += block.samples.length / block.channels;
    push(block);
  };
};

export { attachAudioFrameCounter };
