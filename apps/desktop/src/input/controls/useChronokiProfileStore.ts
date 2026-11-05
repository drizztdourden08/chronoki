/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { InputProfileStore } from '@drizztdourden08/brock-input/renderer';
import { getInputManager } from '../input-manager/get-input-manager';
import { commitInputState } from '../profile-store/commit-input-state';
import { loadInputState } from '../profile-store/load-input-state';
import { profileFromBrock } from './profile-from-brock';
import { profileToBrock } from './profile-to-brock';

const useChronokiProfileStore = (profileId: string, onLoaded: () => void): InputProfileStore =>
  useMemo((): InputProfileStore => ({
    load: async () => {
      const m = getInputManager();
      await loadInputState(m, profileId);
      onLoaded();
      return m.profiles.map(profileToBrock);
    },
    save: async (profiles) => {
      const m = getInputManager();
      m.setProfiles(profiles.map(profileFromBrock));
      await commitInputState(m);
    },
    get activeId() { return getInputManager().activeProfile?.id ?? null; },
    activate: (profile) => {
      const m = getInputManager();
      m.setProfile(profileFromBrock(profile));
      m.reevaluateControllerPresence();
      void commitInputState(m);
    },
    onActiveChange: (listener) => getInputManager().onActiveProfileChange((profile) => listener(profileToBrock(profile))),
  }), [profileId, onLoaded]);

export { useChronokiProfileStore };
