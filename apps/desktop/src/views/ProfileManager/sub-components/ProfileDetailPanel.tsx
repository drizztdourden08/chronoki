/* @layer renderer-components @kind component */
import { useState } from 'react';
import { Stack, Tabs } from '@drizztdourden08/tessera/primitives';
import { MODE_LABELS } from '@app/profiles/profile-mode-labels.constants';
import { modeOfProfile } from '@app/profiles/mode-of-profile';
import { DATA_TAB, OVERVIEW_TAB, PROFILE_TABS, SETTINGS_TAB } from '../ProfileManager.constants';
import type { ProfileDetailPanelProps } from '../ProfileManager.type';
import { useProfileSettings } from '../behavior/useProfileSettings';
import { ProfileDataTab } from './ProfileDataTab';
import { ProfileDetailHeader } from './ProfileDetailHeader';
import { ProfileOverviewTab } from './ProfileOverviewTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';

const ProfileDetailPanel = ({ profile, onOpen, onDelete }: ProfileDetailPanelProps) => {
  const [tab, setTab] = useState<string>(OVERVIEW_TAB);
  const settings = useProfileSettings(profile.id);
  const modeLabel = MODE_LABELS[modeOfProfile(profile, settings?.vanillaSafe === true)];

  return (
    <Stack gap="lg">
      <ProfileDetailHeader profile={profile} modeLabel={modeLabel} onOpen={() => onOpen(profile)} onDelete={() => onDelete(profile)} />
      <Tabs tabs={PROFILE_TABS} activeTab={tab} onTabChange={setTab} />
      {tab === OVERVIEW_TAB && <ProfileOverviewTab profile={profile} modeLabel={modeLabel} />}
      {tab === SETTINGS_TAB && <ProfileSettingsTab profile={profile} />}
      {tab === DATA_TAB && <ProfileDataTab profile={profile} />}
    </Stack>
  );
};

export { ProfileDetailPanel };
