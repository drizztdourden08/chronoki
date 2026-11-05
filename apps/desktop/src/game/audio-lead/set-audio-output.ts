/* @layer bridge-wasm @kind logic */
import { audioOutputState } from './audio-output-state';

const setAudioOutput = (sampleRate: number, channels: number): void => {
  audioOutputState.sampleRate = sampleRate;
  audioOutputState.channels = channels;
};

export { setAudioOutput };
