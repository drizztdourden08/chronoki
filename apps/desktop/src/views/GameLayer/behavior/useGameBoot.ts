/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPlatform } from '@drizztdourden08/brock-react';
import { startGame, stopGame } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import type { BootedPlan, GameBootArgs, SessionPicture } from '../GameLayer.type';
import { sessionPictureOf } from './session-picture-of';
import { useFrameReplan } from './useFrameReplan';
import { useStageSettled } from './useStageSettled';

const useGameBoot = ({ canvasRef, launch }: GameBootArgs): SessionPicture | null => {
  const { config, settings, volume, pictureRatio, onStarted } = useGameSession();
  const started = useRef<number | null>(null);
  const [booted, setBooted] = useState<BootedPlan | null>(null);
  const settled = useStageSettled(launch, config);
  const planned = useMemo<BootedPlan>(() => ({ config, settings, ratio: pictureRatio }), [config, settings, pictureRatio]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (launch === null) {
      if (started.current !== null) {
        started.current = null;
        setBooted(null);
        void stopGame();
      }
      return;
    }
    if (!canvas || !settled || started.current === launch.id) return;
    started.current = launch.id;
    setBooted(planned);
    void startGame({ canvas, files: getPlatform().files, romFile: launch.romFile, profileId: launch.profileId, config, settings, volume })
      .then((ok) => { if (ok) onStarted(); });
  }, [canvasRef, launch, settled, planned, config, settings, volume, onStarted]);

  const onReplanned = useCallback((plan: BootedPlan) => {
    setBooted(plan);
    onStarted();
  }, [onStarted]);

  useFrameReplan({ booted, planned, volume, onReplanned });

  return useMemo(() => (booted ? sessionPictureOf(booted, planned) : null), [booted, planned]);
};

export { useGameBoot };
