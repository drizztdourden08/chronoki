/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { presentRatioOf } from '@chronoki/game-core';
import { GameCanvas, useCoreState } from '@drizztdourden08/brock-port-kit/renderer';
import { Box, Canvas, Text } from '@drizztdourden08/tessera/primitives';
import { chronokiCore } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import { GAME_LAYER_ERROR_TITLE, GAME_LAYER_LABEL } from './GameLayer.constants';
import { presentModeOf } from './behavior/present-mode-of';
import { stageClass } from './behavior/stage-class';
import { useEdgeGlowLoop } from './behavior/useEdgeGlowLoop';
import { useGameBoot } from './behavior/useGameBoot';
import { useAspectRatioLock } from './behavior/useAspectRatioLock';
import { useGameInput } from './behavior/useGameInput';
import { useLegacyStretchMigration } from './behavior/useLegacyStretchMigration';
import { usePresentSize } from './behavior/usePresentSize';
import { useStageArea } from './behavior/useStageArea';
import { useViewport } from './behavior/useViewport';
import './GameLayer.css';

const GameLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { launch, gates, setStageArea, onFunctionAction, onFunctionRelease } = useGameSession();
  const { status, error } = useCoreState(chronokiCore);
  const { viewport, pixelPerfect } = useViewport();
  const mode = presentModeOf(viewport, pixelPerfect);
  useLegacyStretchMigration();
  useStageArea(stageRef, setStageArea);
  const picture = useGameBoot({ canvasRef, launch });
  usePresentSize(stageRef, picture, mode);
  useEdgeGlowLoop({ status, canvasRef, fxCanvasRef, gates });
  useAspectRatioLock(launch !== null, picture ? presentRatioOf(picture.frame, picture.ratio) : 0);
  useGameInput(status === 'running' || status === 'paused', launch?.profileId ?? null, onFunctionAction, onFunctionRelease);

  return (
    <Box className="game-layer">
      <Box ref={stageRef} className={stageClass({ visible: launch !== null, gates, mode })}>
        <GameCanvas canvasRef={canvasRef} label={GAME_LAYER_LABEL} />
        <Canvas ref={fxCanvasRef} className="game-layer__fx" aria-hidden="true" />
      </Box>
      {status === 'error' && <Text className="game-layer__error" variant="body">{`${GAME_LAYER_ERROR_TITLE}: ${error ?? ''}`}</Text>}
    </Box>
  );
};

export { GameLayer };
