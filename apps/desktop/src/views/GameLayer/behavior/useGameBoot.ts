/* @layer renderer-components @kind hook */
import { useEffect, useRef } from 'react';
import { getPlatform } from '@drizztdourden08/brock-react';
import { startGame, stopGame } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import type { GameBootArgs } from '../GameLayer.type';

const useGameBoot = ({ canvasRef, launch }: GameBootArgs): void => {
  const { config, settings, volume, onStarted } = useGameSession();
  const started = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (launch === null) {
      if (started.current !== null) {
        started.current = null;
        void stopGame();
      }
      return;
    }
    if (!canvas || started.current === launch.id) return;
    started.current = launch.id;
    void startGame({ canvas, files: getPlatform().files, romFile: launch.romFile, profileId: launch.profileId, config, settings, volume })
      .then((ok) => { if (ok) onStarted(); });
  }, [canvasRef, launch, config, settings, volume, onStarted]);
};

export { useGameBoot };
