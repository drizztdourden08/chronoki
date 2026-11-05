/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { SidePanel } from '@drizztdourden08/tessera/composites';
import type { OptionTabProps } from '@drizztdourden08/brock-randomizer';
import { CtPoolListing } from './CtPoolListing';
import { ctPoolGroupsOf } from './ct-pool-groups-of';
import { POOL_CONTAINER_TITLE, POOL_PANEL_SIZE, POOL_PANEL_TITLE, POOL_STORAGE_KEY } from './ct-pool-listing.constants';
import { ctPoolTotalsOf } from './ct-pool-totals-of';
import { useCtPoolImpacts } from './useCtPoolImpacts';

const CtOptionsAside = ({ values, seed, romFile }: OptionTabProps) => {
  const { pool, error } = useCtPoolImpacts(values, seed, romFile);
  const groups = useMemo(() => (pool === null ? [] : ctPoolGroupsOf(pool)), [pool]);
  const totals = useMemo(() => (pool === null ? null : ctPoolTotalsOf(pool)), [pool]);

  return (
    <SidePanel
      side="end"
      title={POOL_PANEL_TITLE}
      {...POOL_PANEL_SIZE}
      storageKey={POOL_STORAGE_KEY}
      containers={[{
        title: POOL_CONTAINER_TITLE,
        content: <CtPoolListing groups={groups} totals={totals} error={error} titled={false} />,
      }]}
    />
  );
};

export { CtOptionsAside };
