/* @layer renderer-components @kind component */
import { Box, ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import { CtPoolFillBar } from './CtPoolFillBar';
import { POOL_PANEL_TITLE } from './ct-pool-listing.constants';
import type { CtPoolListingProps } from './ct-pool-listing.type';
import './ct-pool-listing.css';

const CtPoolListing = ({ groups, totals, error, titled = true }: CtPoolListingProps) => (
  <Box className="ct-pool-listing">
    <Box className="ct-pool-listing__header">
      {titled && <Text className="ct-pool-listing__title">{POOL_PANEL_TITLE}</Text>}
      <CtPoolFillBar totals={totals} error={error} />
    </Box>
    <ScrollArea className="ct-pool-listing__body">
      {groups.map((group) => (
        <Box key={group.id} className="ct-pool-listing__group">
          <Box className="ct-pool-listing__group-head">
            <Text className="ct-pool-listing__group-title">{group.label}</Text>
            <Text className="ct-pool-listing__count">{`×${group.total}`}</Text>
          </Box>
          {group.rows.map((row) => (
            <Box key={row.name} className="ct-pool-listing__row">
              <Text className="ct-pool-listing__name">{row.name}</Text>
              <Text className="ct-pool-listing__count">{`×${row.count}`}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </ScrollArea>
  </Box>
);

export { CtPoolListing };
