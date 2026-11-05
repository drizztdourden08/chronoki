/* @layer bridge-wasm @kind logic */
import { liveSettingsState } from './live-settings-state';
import type { LiveSettingsState } from './live-settings.type';

const setLiveSettings = (next: LiveSettingsState): void => {
  liveSettingsState.dimFlashes = next.dimFlashes;
};

export { setLiveSettings };
