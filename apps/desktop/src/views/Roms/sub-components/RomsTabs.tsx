/* @layer renderer-components @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import { ROMS_TABS } from '../Roms.tabs.constants';
import type { RomsTabsProps } from './RomsTabs.type';

const RomsTabs = ({ value, onChange }: RomsTabsProps) => (
  <SegmentedControl value={value} options={[...ROMS_TABS]} onChange={onChange} />
);

export { RomsTabs };
