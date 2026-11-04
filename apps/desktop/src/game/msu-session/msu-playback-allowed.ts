/* @layer bridge-wasm @kind logic */
import { isAudioDisabled } from '@app/settings-controls/audio/is-audio-disabled';
import type { AppSettings } from '@app/settings.type';

const msuPlaybackAllowed = (settings: AppSettings): boolean => !isAudioDisabled('resumeMSU', settings);

export { msuPlaybackAllowed };
