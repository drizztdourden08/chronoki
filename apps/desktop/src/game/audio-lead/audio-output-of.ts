/* @layer bridge-wasm @kind logic */
import { AUDIO_OUTPUT_AUTO } from './audio-output.constants';
import { audioOutputState } from './audio-output-state';

const audioOutputOf = (): { audioSampleRate?: number; audioChannels?: number } => {
  const { sampleRate, channels } = audioOutputState;
  return {
    audioSampleRate: sampleRate > AUDIO_OUTPUT_AUTO ? sampleRate : undefined,
    audioChannels: channels > AUDIO_OUTPUT_AUTO ? channels : undefined,
  };
};

export { audioOutputOf };
