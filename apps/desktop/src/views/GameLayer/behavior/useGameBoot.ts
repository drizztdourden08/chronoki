/* @layer renderer-components @kind hook */
import { useEffect, useRef, useState } from 'react';
import { getPlatform } from '@drizztdourden08/brock-react';
import { frameSizeOf } from '@chronoki/game-core';
import { startGame, stopGame } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import type { GameBootArgs, SessionPicture } from '../GameLayer.type';
import { useStageSettled } from './useStageSettled';

const useGameBoot = ({ canvasRef, launch }: GameBootArgs): SessionPicture | null => {
  const { config, settings, volume, pictureRatio, onStarted } = useGameSession();
  const started = useRef<number | null>(null);
  const [picture, setPicture] = useState<SessionPicture | null>(null);
  const settled = useStageSettled(launch, config);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (launch === null) {
      if (started.current !== null) {
        started.current = null;
        setPicture(null);
        void stopGame();
      }
      return;
    }
    if (!canvas || !settled || started.current === launch.id) return;
    started.current = launch.id;
    setPicture({ frame: frameSizeOf({ ...settings, renderScale: 1, interpolation: false }), ratio: pictureRatio });
    void startGame({ canvas, files: getPlatform().files, romFile: launch.romFile, profileId: launch.profileId, config, settings, volume })
      .then((ok) => { if (ok) onStarted(); });
  }, [canvasRef, launch, settled, config, settings, volume, pictureRatio, onStarted]);

  return picture;
};

export { useGameBoot };
