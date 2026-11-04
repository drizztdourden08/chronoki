/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import type { PlaySession } from '@drizztdourden08/brock-core';
import { onSessionsChanged } from '@app/game/session-tracker';
import { listSessions } from '@app/storage/profile-data-store';
import { SESSION_LIST_LIMIT } from '../HomeTab.constants';

const usePlaySessions = (profileId: string | null, running: boolean): PlaySession[] => {
  const [sessions, setSessions] = useState<PlaySession[]>([]);
  const [reloads, setReloads] = useState(0);

  useEffect(() => onSessionsChanged(() => setReloads((count) => count + 1)), []);

  useEffect(() => {
    let current = true;
    if (!profileId) {
      setSessions([]);
      return undefined;
    }
    void listSessions(profileId).then((list) => { if (current) setSessions(list.slice(0, SESSION_LIST_LIMIT)); });
    return () => { current = false; };
  }, [profileId, running, reloads]);

  return sessions;
};

export { usePlaySessions };
