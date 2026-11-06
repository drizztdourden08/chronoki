/* @layer renderer-widgets @kind constants */
import type { ControlHint } from '@drizztdourden08/brock-react';

const SEARCH_PLACEHOLDER = 'Search checks...';
const COLLECT_HINT: readonly ControlHint[] = [{ glyph: 'mouse-left', label: 'Give the item and record the check' }];
const NO_MATCH_TEXT = 'No check matches.';

export { COLLECT_HINT, NO_MATCH_TEXT, SEARCH_PLACEHOLDER };
