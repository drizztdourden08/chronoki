/* @layer renderer-components @kind types */
import type { RomsTab } from '../Roms.tabs.type';

interface RomsTabsProps {
  value: RomsTab;
  onChange: (tab: RomsTab) => void;
}

export type { RomsTabsProps };
