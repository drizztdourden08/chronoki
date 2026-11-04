/* @layer renderer-components @kind component */
import { Callout, Card, Spinner, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { Profile } from '@drizztdourden08/brock-core';
import { useProfileSettings } from '../behavior/useProfileSettings';
import { formatSettingValue } from '../settings-sections/format-setting-value';
import { SETTINGS_SECTIONS } from '../settings-sections/settings-sections.constants';

const ProfileSettingsTab = ({ profile }: { profile: Profile }) => {
  const settings = useProfileSettings(profile.id);

  if (settings === undefined) return <Spinner size="md" />;
  if (settings === null) return <Text variant="caption" tone="muted">No settings saved yet.</Text>;
  return (
    <Stack gap="lg">
      <Callout tone="info" variant="footnote">Read only. Change these in Settings.</Callout>
      {SETTINGS_SECTIONS.map(({ title, keys }) => (
        <Card key={title} title={title} level={4}>
          <FactsPanel
            groups={[keys.map(({ key, label, format }) => ({ label, value: formatSettingValue(settings[key], format) }))]}
            layout="rows"
            label={title}
          />
        </Card>
      ))}
    </Stack>
  );
};

export { ProfileSettingsTab };
