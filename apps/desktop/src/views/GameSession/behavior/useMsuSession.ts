/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { setMsuLive, startCtMsuSession, stopCtMsuSession } from '@app/game/msu-session';
import type { AppSettings } from '@app/settings.type';
import type { Profile } from '@drizztdourden08/brock-core';
import type { GameLaunch } from '../GameSession.type';

const useMsuSession = (profile: Profile | null, launch: GameLaunch | null, running: boolean, gates: ReadonlySet<string>): void => {
  const packName = profile?.msuPack ?? null;
  const launchId = launch?.id ?? null;
  const { settings } = useSettings<AppSettings>();
  const { vanillaSafe, enableMSU, msuConfigMode } = settings;

  useEffect(() => { setMsuLive({ settings, gates }); }, [settings, gates]);

  useEffect(() => {
    if (!running || !packName) return undefined;
    void startCtMsuSession(packName);
    return stopCtMsuSession;
  }, [running, packName, launchId, vanillaSafe, enableMSU, msuConfigMode]);
};

export { useMsuSession };
