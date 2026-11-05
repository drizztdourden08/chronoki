/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { useProfiles } from '@drizztdourden08/brock-react';
import type { Profile } from '@drizztdourden08/brock-core';
import { useDeleteProfile } from './useDeleteProfile';
import { useLoadingProfile } from './useLoadingProfile';
import { useReadyRoms } from './useReadyRoms';

const useProfileManager = (onOpenProfile: (profile: Profile) => void) => {
  const { profiles } = useProfiles();
  const remove = useDeleteProfile();
  const loadingProfile = useLoadingProfile(profiles);
  const readyRoms = useReadyRoms();
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [listCollapsed, setListCollapsed] = useState(false);

  const selectedProfile = profiles.find((profile) => profile.id === selected) ?? null;

  const startCreating = useCallback(() => {
    setCreating(true);
    setListCollapsed(true);
  }, []);

  const stopCreating = useCallback(() => {
    setCreating(false);
    setListCollapsed(false);
  }, []);

  const select = useCallback((id: string) => {
    setSelected(id);
    stopCreating();
  }, [stopCreating]);

  const finishCreating = useCallback((profile: Profile) => {
    setSelected(profile.id);
    stopCreating();
    onOpenProfile(profile);
  }, [stopCreating, onOpenProfile]);

  return {
    profiles, readyRoms, remove, loadingProfile,
    selectedProfile, select,
    creating, startCreating, stopCreating, finishCreating,
    listCollapsed, setListCollapsed,
  };
};

export { useProfileManager };
