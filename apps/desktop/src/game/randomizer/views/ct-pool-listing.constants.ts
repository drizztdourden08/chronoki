/* @layer renderer-components @kind constants */
import type { StackedBarColor } from '@drizztdourden08/tessera/primitives';

const GROUP_LABELS = { keyItems: 'Key items', items: 'Items' } as const;

const FILL_SEGMENTS: readonly { key: 'keyItems' | 'items' | 'open'; color: StackedBarColor; label: string; description: string }[] = [
  { key: 'keyItems', color: 'secondary', label: 'key items', description: 'Key items the shuffle places' },
  { key: 'items', color: 'warning', label: 'items', description: 'Chest, gift and filler items the shuffle places' },
  { key: 'open', color: 'danger', label: 'open', description: 'Locations this seed generates that hold no shuffled item' },
];

const FILL_TOTAL_TITLE = 'Every location this seed generates';

const FILL_BAR_LABEL = 'Item pool';

const POOL_PANEL_TITLE = 'Item pool';

const POOL_CONTAINER_TITLE = 'Contents';

const POOL_STORAGE_KEY = 'randomizer:item-pool-width';

const POOL_PANEL_SIZE = { width: 304, minWidth: 240, maxWidth: 420 };

const POOL_UNAVAILABLE = 'pool not available';

const ASIDE_LABEL = 'Pool';

export {
  ASIDE_LABEL, FILL_BAR_LABEL, FILL_SEGMENTS, FILL_TOTAL_TITLE, GROUP_LABELS, POOL_CONTAINER_TITLE, POOL_PANEL_SIZE,
  POOL_PANEL_TITLE, POOL_STORAGE_KEY, POOL_UNAVAILABLE,
};
