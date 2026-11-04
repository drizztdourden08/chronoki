/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { AutoSavesSection } from './sections/AutoSavesSection';
import { NormalSavesSection } from './sections/NormalSavesSection';
import { QuickSavesSection } from './sections/QuickSavesSection';
import type { HomeTabProps } from './HomeTab.type';
import './HomeTab.css';

const HomeTab = ({ normal, ...section }: HomeTabProps) => (
  <Box className="home-tab">
    <Box className="home-tab__columns">
      <Box className="home-tab__col">
        <QuickSavesSection {...section} />
      </Box>
      <Box className="home-tab__col">
        <NormalSavesSection normal={normal} running={section.running} />
        <AutoSavesSection {...section} />
      </Box>
    </Box>
  </Box>
);

export { HomeTab };
