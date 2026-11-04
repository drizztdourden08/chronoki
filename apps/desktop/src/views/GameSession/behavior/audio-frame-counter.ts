/* @layer renderer-appshell @kind logic */
import type { AudioAdapter } from '@drizztdourden08/brock-port-kit/renderer';

const totals = { frames: 0 };

const attachAudioFrameCounter = (adapter: AudioAdapter): void => {
  totals.frames = 0;
  const push = adapter.pushSamples.bind(adapter);
  adapter.pushSamples = (block) => {
    totals.frames += block.samples.length / block.channels;
    push(block);
  };
};

const audioFrameTotal = (): number => totals.frames;

export { attachAudioFrameCounter, audioFrameTotal };
