/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import { Grid, SectionHeader, Status, Tag } from '@drizztdourden08/tessera/primitives';
import { StatTiles, tallyOutOf } from '@drizztdourden08/brock-randomizer/renderer';
import type { RunPanelProps } from '@drizztdourden08/brock-randomizer';
import { CtPoolFillBar } from './CtPoolFillBar';
import { ctPoolTotalsOf } from './ct-pool-totals-of';
import { ctPoolTilesOf } from './ct-pool-tiles-of';
import { ctScopeFlagsOf } from './ct-scope-flags-of';
import { FLAG_MIN_WIDTH, SCOPES_TITLE } from './ct-settings.constants';
import { ctValuesOf } from './ct-values-of';
import { useCtPoolImpacts } from './useCtPoolImpacts';

const CtPoolPanel = ({ config, romFile }: RunPanelProps) => {
  const values = useMemo(() => ctValuesOf(config.options), [config.options]);
  const { pool, error } = useCtPoolImpacts(values, config.seed, romFile);
  const flags = ctScopeFlagsOf(values);

  return (
    <>
      <CtPoolFillBar totals={pool === null ? null : ctPoolTotalsOf(pool)} error={error} />
      {pool !== null && <StatTiles tiles={ctPoolTilesOf(pool)} />}
      <SectionHeader title={SCOPES_TITLE} action={<Tag>{tallyOutOf({ count: flags.filter((flag) => flag.on).length, total: flags.length })}</Tag>} />
      <Grid minColWidth={FLAG_MIN_WIDTH} gap="xs">
        {flags.map((flag) => (
          <Status key={flag.id} tone={flag.on ? 'success' : 'neutral'} variant="pill" dot title={`${flag.label}: ${flag.on ? 'on' : 'off'}`}>
            {flag.label}
          </Status>
        ))}
      </Grid>
    </>
  );
};

export { CtPoolPanel };
