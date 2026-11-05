/* @layer renderer-widgets @kind constants */
import type { ControlHint } from '@drizztdourden08/brock-react';

const SNAPSHOT_REFRESH_MS = 500;
const NOT_RUNNING_TEXT = 'Start the game to use the cheats.';
const DEFAULT_TAB = 'items';
const WRITE_REFUSED_TEXT = 'Not now: wait for the game to be in a safe moment, then press again.';
const OPEN_HINT: readonly ControlHint[] = [{ glyph: 'mouse-left', label: 'Open' }];
const LEGEND_ITEMS: readonly ControlHint[] = [
  { glyph: 'mouse-left', label: 'Pick or open' },
  { glyph: 'wheel', label: 'Scroll the list' },
];

export { DEFAULT_TAB, LEGEND_ITEMS, NOT_RUNNING_TEXT, OPEN_HINT, SNAPSHOT_REFRESH_MS, WRITE_REFUSED_TEXT };
