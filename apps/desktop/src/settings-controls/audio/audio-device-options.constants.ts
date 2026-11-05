/* @layer renderer-app @kind config */
import { AUDIO_OUTPUT_AUTO } from '@app/game/audio-lead';

const SAMPLE_RATE_OPTIONS = [
  { value: String(AUDIO_OUTPUT_AUTO), label: 'Auto' },
  { value: '44100', label: '44100 Hz' },
  { value: '48000', label: '48000 Hz' },
];

const CHANNEL_OPTIONS = [
  { value: String(AUDIO_OUTPUT_AUTO), label: 'Auto' },
  { value: '1', label: 'Mono' },
  { value: '2', label: 'Stereo' },
];

export { CHANNEL_OPTIONS, SAMPLE_RATE_OPTIONS };
