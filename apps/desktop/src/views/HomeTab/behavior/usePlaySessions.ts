/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import type { PlaySession } from '@drizztdourden08/brock-core';
import { listSessions } from '@app/storage/profile-data-store';
import { SESSION_LIST_LIMIT } from '../HomeTab.constants';

const usePlaySessions = (profileId: string | null, running: boolean): PlaySession[] => {
  const [sessions, setSessions] = useState<PlaySession[]>([]);

  useEffect(() => {
    let current = true;
    if (!profileId) {
      setSessions([]);
      return undefined;
    }
    void listSessions(profileId).then((list) => { if (current) setSessions(list.slice(0, SESSION_LIST_LIMIT)); });
    return () => { current = false; };
  }, [profileId, running]);

  return sessions;
};

export { usePlaySessions };
