/* @layer renderer-app @kind constants */
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';

const ASPECT_LIMITS = { min: 256 / 480, max: 544 / 224 };

const ENGINE_LINES = 224;

const WIDE_PRESETS: SegmentOption[] = [
  { value: '4:3', label: '4:3' },
  { value: '16:10', label: '16:10' },
  { value: '16:9', label: '16:9' },
  { value: '21:9', label: '21:9' },
];

const TALL_PRESETS: SegmentOption[] = [
  { value: '4:5', label: '4:5' },
  { value: '3:4', label: '3:4' },
];

const BASE_OPTIONS: SegmentOption[] = [
  { value: 'original', label: 'Original' },
  { value: 'auto', label: 'Auto' },
  { value: 'screen', label: 'Screen' },
  { value: 'wide', label: 'Wide' },
];

const TALL_OPTION: SegmentOption = { value: 'tall', label: 'Tall' };

const CUSTOM_OPTION: SegmentOption = { value: 'custom', label: 'Custom' };

const ASPECT_DESCRIPTIONS: Record<string, string> = {
  original: 'Use the original 256-pixel width.',
  auto: 'Matches the window size.',
  screen: 'Matches the full physical screen ratio.',
  wide: 'Choose a fixed wide ratio, drawn as extra width around the original picture.',
  tall: 'Choose a tall ratio. The engine still draws 224 lines, so the picture is letterboxed with bars above and below.',
  custom: 'Set an exact width : height ratio.',
};

const ASPECT_RECOMMENDED_NOTE = 'Best for most setups.';

const ASPECT_LOCKED_MESSAGE = 'Turn on Extended Rendering to pick a ratio other than Original.';

const ASPECT_VANILLA_LOCKED_MESSAGE = 'Vanilla Safe keeps the original picture. Turn it off to pick a ratio.';

const TALL_GATE = 'tallRendering';

const LETTERBOX_NOTE = `Letterboxed: the engine draws ${ENGINE_LINES} lines`;

export {
  ASPECT_DESCRIPTIONS, ASPECT_LIMITS, ASPECT_LOCKED_MESSAGE, ASPECT_RECOMMENDED_NOTE, ASPECT_VANILLA_LOCKED_MESSAGE,
  BASE_OPTIONS, CUSTOM_OPTION, ENGINE_LINES, LETTERBOX_NOTE, TALL_GATE, TALL_OPTION, TALL_PRESETS, WIDE_PRESETS,
};
