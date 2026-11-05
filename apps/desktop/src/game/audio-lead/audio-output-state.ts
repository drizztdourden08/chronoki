/* @layer bridge-wasm @kind logic */
import { AUDIO_OUTPUT_AUTO } from './audio-output.constants';

const audioOutputState: { sampleRate: number; channels: number } = { sampleRate: AUDIO_OUTPUT_AUTO, channels: AUDIO_OUTPUT_AUTO };

export { audioOutputState };
