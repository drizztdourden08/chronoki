/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { NormalSavesSection } from './sections/NormalSavesSection';
import { QuickSavesSection } from './sections/QuickSavesSection';
import type { HomeSectionProps } from './HomeTab.type';
import './HomeTab.css';

const HomeTab = (props: HomeSectionProps) => (
  <Box className="home-tab">
    <Box className="home-tab__columns">
      <Box className="home-tab__col">
        <QuickSavesSection {...props} />
      </Box>
      <Box className="home-tab__col">
        <NormalSavesSection {...props} />
      </Box>
    </Box>
  </Box>
);

export { HomeTab };
