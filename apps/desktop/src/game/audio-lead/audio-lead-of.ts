/* @layer bridge-wasm @kind logic */
import { DEFAULT_AUDIO_LEAD_S, DEFAULT_AUDIO_SAMPLES } from './audio-lead.constants';
import { audioLeadState } from './audio-lead-state';

const audioLeadOf = (): number | undefined => {
  const { samples } = audioLeadState;
  if (samples === DEFAULT_AUDIO_SAMPLES || !(samples > 0)) return undefined;
  return DEFAULT_AUDIO_LEAD_S * (samples / DEFAULT_AUDIO_SAMPLES);
};

export { audioLeadOf };
