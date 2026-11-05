/* @layer renderer-components @kind component */
import { useState } from 'react';
import { Stack, Tabs } from '@drizztdourden08/tessera/primitives';
import { modeOf } from '@app/profile-modes';
import { ProfileRandomizerTab } from '@drizztdourden08/brock-randomizer/renderer';
import { DATA_TAB, OVERVIEW_TAB, PROFILE_TABS, RANDOMIZER_PROFILE_TAB, RANDOMIZER_TAB, SETTINGS_TAB } from '../ProfileManager.constants';
import type { ProfileDetailPanelProps } from '../ProfileManager.type';
import { useProfileSettings } from '../behavior/useProfileSettings';
import { ProfileDataTab } from './ProfileDataTab';
import { ProfileDetailHeader } from './ProfileDetailHeader';
import { ProfileOverviewTab } from './ProfileOverviewTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import './ProfileDetailPanel.css';

const ProfileDetailPanel = ({ profile, onOpen, onDelete }: ProfileDetailPanelProps) => {
  const [tab, setTab] = useState<string>(OVERVIEW_TAB);
  const settings = useProfileSettings(profile.id);
  const mode = modeOf(profile, settings);
  const randomizer = profile.randomizer;
  const tabs = randomizer ? [...PROFILE_TABS, RANDOMIZER_PROFILE_TAB] : PROFILE_TABS;

  return (
    <Stack gap="lg" className="profile-detail">
      <ProfileDetailHeader profile={profile} mode={mode} onOpen={() => onOpen(profile)} onDelete={() => onDelete(profile)} />
      <Tabs tabs={tabs} activeTab={tab} onTabChange={setTab} />
      {tab === OVERVIEW_TAB && <ProfileOverviewTab profile={profile} mode={mode} />}
      {tab === SETTINGS_TAB && <ProfileSettingsTab profile={profile} />}
      {tab === DATA_TAB && <ProfileDataTab profile={profile} />}
      {tab === RANDOMIZER_TAB && randomizer && <ProfileRandomizerTab randomizer={randomizer} />}
    </Stack>
  );
};

export { ProfileDetailPanel };
