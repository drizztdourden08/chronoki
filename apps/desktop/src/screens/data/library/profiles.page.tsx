/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { useProfiles } from '@drizztdourden08/brock-react';
import type { PageProps, ScreenMeta } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { ProfileManager } from '@app/views/ProfileManager';

const meta: ScreenMeta = { title: 'Profiles', icon: 'users', showHeader: true, order: 1, fill: true, keywords: ['profile', 'create', 'delete', 'rom', 'mode', 'original', 'enhanced'] };

const ProfilesPage = ({ open }: PageProps) => {
  const { select } = useProfiles();

  const openProfile = useCallback((profile: Profile) => {
    void select(profile).then(() => open('game'));
  }, [select, open]);

  return <ProfileManager onOpenProfile={openProfile} />;
};

export default ProfilesPage;
export { meta };
