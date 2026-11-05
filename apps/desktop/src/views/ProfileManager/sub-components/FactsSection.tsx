/* @layer renderer-components @kind component */
import { SectionHeader, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { FactsSectionProps } from '../ProfileManager.type';

const FactsSection = ({ title, hint, facts }: FactsSectionProps) => (
  <Stack gap="sm" className="profile-detail__section">
    <SectionHeader title={title} level={4} />
    {hint && <Text variant="caption" tone="muted">{hint}</Text>}
    <FactsPanel groups={facts} layout="rows" label={title} />
  </Stack>
);

export { FactsSection };
