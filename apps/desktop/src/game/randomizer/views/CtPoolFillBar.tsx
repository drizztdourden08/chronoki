/* @layer renderer-components @kind component */
import { Box, StackedBar, Text } from '@drizztdourden08/tessera/primitives';
import type { StackedBarSegment } from '@drizztdourden08/tessera/primitives';
import { FILL_BAR_LABEL, FILL_SEGMENTS, FILL_TOTAL_TITLE, POOL_UNAVAILABLE } from './ct-pool-listing.constants';
import type { CtPoolTotals } from './ct-pool-totals.type';
import './ct-pool-listing.css';

const segmentsOf = (totals: CtPoolTotals): StackedBarSegment[] =>
  FILL_SEGMENTS.map(({ key, label, description, color }) => ({ id: key, label, description, color, value: totals[key] }));

const CtPoolFillBar = ({ totals, error }: { totals: CtPoolTotals | null; error?: string }) => {
  if (totals === null) {
    return (
      <Box className="ct-pool-fill">
        <Text className="ct-pool-fill__error">{error ?? POOL_UNAVAILABLE}</Text>
      </Box>
    );
  }
  const segments = segmentsOf(totals);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  return (
    <Box className="ct-pool-fill">
      <StackedBar segments={segments} label={FILL_BAR_LABEL} legend />
      <Text className="ct-pool-fill__total" title={FILL_TOTAL_TITLE}>{`total ${total}`}</Text>
    </Box>
  );
};

export { CtPoolFillBar };
