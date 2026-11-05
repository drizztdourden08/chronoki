/* @layer bridge-wasm @kind logic */
import { audioLeadState } from './audio-lead-state';

const setAudioSamples = (samples: number): void => {
  audioLeadState.samples = samples;
};

export { setAudioSamples };
