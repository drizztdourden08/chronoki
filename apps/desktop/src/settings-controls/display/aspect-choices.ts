/* @layer renderer-app @kind logic */
import { BASE_OPTIONS, CUSTOM_OPTION, TALL_OPTION, TALL_PRESETS, WIDE_PRESETS } from './display.constants';
import type { AspectChoices } from './display.type';

const aspectChoices = (tallOn: boolean): AspectChoices => ({
  options: [...BASE_OPTIONS, ...(tallOn ? [TALL_OPTION] : []), CUSTOM_OPTION],
  widePresets: WIDE_PRESETS,
  tallPresets: tallOn ? TALL_PRESETS : undefined,
});

export { aspectChoices };
