/* @layer renderer-components @kind component */
import { useState } from 'react';
import { Button, Flex, Icon, Stack, Tabs, Title } from '@drizztdourden08/tessera/primitives';
import { DATA_TAB, OVERVIEW_TAB, PROFILE_TABS, PROFILE_TEXT, SETTINGS_TAB } from '../ProfileManager.constants';
import type { ProfileDetailPanelProps } from '../ProfileManager.type';
import { ProfileDataTab } from './ProfileDataTab';
import { ProfileOverviewTab } from './ProfileOverviewTab';
import { ProfileSettingsTab } from './ProfileSettingsTab';

const ProfileDetailPanel = ({ profile, readyRoms, onOpen, onDelete }: ProfileDetailPanelProps) => {
  const [tab, setTab] = useState<string>(OVERVIEW_TAB);

  return (
    <Stack gap="lg">
      <Flex justify="between" align="start" gap="md" wrap>
        <Title level={3}>{profile.name}</Title>
        <Flex gap="sm" align="center" wrap>
          <Button variant="primary" icon={<Icon name="play" />} onClick={() => onOpen(profile)}>{PROFILE_TEXT.open}</Button>
          <Button variant="danger" icon={<Icon name="trash-2" />} onClick={() => onDelete(profile)}>{PROFILE_TEXT.delete}</Button>
        </Flex>
      </Flex>
      <Tabs tabs={PROFILE_TABS} activeTab={tab} onTabChange={setTab} />
      {tab === OVERVIEW_TAB && <ProfileOverviewTab profile={profile} readyRoms={readyRoms} />}
      {tab === SETTINGS_TAB && <ProfileSettingsTab profile={profile} />}
      {tab === DATA_TAB && <ProfileDataTab profile={profile} />}
    </Stack>
  );
};

export { ProfileDetailPanel };
