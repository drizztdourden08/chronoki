/* @layer renderer-components @kind component */
import { Box, Callout, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import type { Profile } from '@drizztdourden08/brock-core';
import { useProfileSettings } from '../behavior/useProfileSettings';
import { settingRowValue } from '../settings-sections/setting-row-value';
import { SETTINGS_SECTIONS } from '../settings-sections/settings-sections.constants';
import { FactsSection } from './FactsSection';

const ProfileSettingsTab = ({ profile }: { profile: Profile }) => {
  const settings = useProfileSettings(profile.id);

  if (settings === undefined) return <Spinner size="md" />;
  if (settings === null) return <Text variant="caption" tone="muted">No settings saved yet.</Text>;
  return (
    <Stack gap="md">
      <Callout tone="info" variant="footnote">Read only. Change these in Settings.</Callout>
      <Box className="profile-detail__grid">
        {SETTINGS_SECTIONS.map(({ title, keys }) => (
          <FactsSection
            key={title}
            title={title}
            facts={[keys.map((row) => ({ label: row.label, value: settingRowValue(settings, row) }))]}
          />
        ))}
      </Box>
    </Stack>
  );
};

export { ProfileSettingsTab };
