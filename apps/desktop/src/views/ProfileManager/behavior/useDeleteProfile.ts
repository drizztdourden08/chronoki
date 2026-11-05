/* @layer renderer-components @kind hook */
import { useCallback } from 'react';
import { confirmAction, useProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { appLog } from '@app/log/app-log';

const useDeleteProfile = () => {
  const { removeConfirmed, refresh } = useProfiles();

  return useCallback(async (profile: Profile) => {
    const confirmed = await confirmAction({
      title: 'Delete Profile',
      message: `Delete "${profile.name}"? Its save data will be lost. This cannot be undone.`,
      confirmLabel: 'Delete Profile',
      variant: 'danger',
    });
    if (!confirmed) return;
    if (await removeConfirmed(profile)) appLog.info('Profile deleted');
    await refresh();
  }, [removeConfirmed, refresh]);
};

export { useDeleteProfile };
