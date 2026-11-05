/* @layer renderer-app @kind config */
import { AUDIO_BUFFER_STEPS } from '@app/game/audio-lead';

const AUDIO_BUFFER_OPTIONS = AUDIO_BUFFER_STEPS.map((samples) => ({ value: String(samples), label: String(samples) }));

export { AUDIO_BUFFER_OPTIONS };
