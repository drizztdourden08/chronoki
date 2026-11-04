/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { frameSizeOf } from '@chronoki/game-core';
import { GameCanvas, useCoreState } from '@drizztdourden08/brock-port-kit/renderer';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { chronokiCore } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import { GAME_LAYER_ERROR_TITLE, GAME_LAYER_LABEL } from './GameLayer.constants';
import { stageClass } from './behavior/stage-class';
import { useGameBoot } from './behavior/useGameBoot';
import { useAspectRatioLock } from './behavior/useAspectRatioLock';
import { useGameInput } from './behavior/useGameInput';
import { useLegacyStretchMigration } from './behavior/useLegacyStretchMigration';
import { usePixelPerfectSize } from './behavior/usePixelPerfectSize';
import { useViewport } from './behavior/useViewport';
import './GameLayer.css';

const GameLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { launch, gates, onFunctionAction, onFunctionRelease } = useGameSession();
  const { status, error } = useCoreState(chronokiCore);
  const { viewport, pixelPerfect } = useViewport();
  const { settings } = useGameSession();
  useLegacyStretchMigration();
  const baseFrame = frameSizeOf({ widescreen: settings.widescreen, wideWidth: settings.wideWidth, renderScale: 1, interpolation: false });
  useAspectRatioLock(launch !== null, baseFrame);
  usePixelPerfectSize(stageRef, pixelPerfect, baseFrame);
  useGameBoot({ canvasRef, launch });
  useGameInput(status === 'running' || status === 'paused', launch?.profileId ?? null, onFunctionAction, onFunctionRelease);

  return (
    <Box className="game-layer">
      <Box ref={stageRef} className={stageClass({ visible: launch !== null, gates, viewport, pixelPerfect })}>
        <GameCanvas canvasRef={canvasRef} label={GAME_LAYER_LABEL} />
      </Box>
      {status === 'error' && <Text className="game-layer__error" variant="body">{`${GAME_LAYER_ERROR_TITLE}: ${error ?? ''}`}</Text>}
    </Box>
  );
};

export { GameLayer };
