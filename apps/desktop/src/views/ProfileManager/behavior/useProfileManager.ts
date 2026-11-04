/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import { useProfiles } from '@drizztdourden08/brock-react';
import { useReadyRoms } from './useReadyRoms';

const useProfileManager = () => {
  const { profiles, remove } = useProfiles();
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

  const finishCreating = useCallback((profileId: string) => {
    setSelected(profileId);
    stopCreating();
  }, [stopCreating]);

  return {
    profiles, readyRoms, remove,
    selectedProfile, select,
    creating, startCreating, stopCreating, finishCreating,
    listCollapsed, setListCollapsed,
  };
};

export { useProfileManager };
