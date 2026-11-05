/* @layer renderer-widgets @kind hook */
import { useEffect, useState } from 'react';
import type { GameInfoSnapshot } from '@chronoki/game-core';
import { readCheatSnapshot } from '@app/game/cheats/cheat-actions';
import { SNAPSHOT_REFRESH_MS } from '../CheatsWidget.constants';

const useCheatSnapshot = (): GameInfoSnapshot | null => {
  const [snapshot, setSnapshot] = useState<GameInfoSnapshot | null>(readCheatSnapshot);
  useEffect(() => {
    const timer = setInterval(() => setSnapshot(readCheatSnapshot()), SNAPSHOT_REFRESH_MS);
    return () => clearInterval(timer);
  }, []);
  return snapshot;
};

export { useCheatSnapshot };
