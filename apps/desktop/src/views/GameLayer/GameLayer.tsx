/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { GameCanvas, useCoreState } from '@drizztdourden08/brock-port-kit/renderer';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { chronokiCore } from '@app/game/lifecycle';
import { useGameSession } from '@app/views/GameSession';
import { GAME_LAYER_ERROR_TITLE, GAME_LAYER_LABEL } from './GameLayer.constants';
import { useGameBoot } from './behavior/useGameBoot';
import { useGameInput } from './behavior/useGameInput';
import './GameLayer.css';

const GameLayer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { launch, onFunctionAction } = useGameSession();
  const { status, error } = useCoreState(chronokiCore);
  useGameBoot({ canvasRef, launch });
  useGameInput(status === 'running' || status === 'paused', launch?.profileId ?? null, onFunctionAction);

  return (
    <Box className="game-layer">
      <Box className={launch ? 'game-layer__stage' : 'game-layer__stage game-layer__stage--idle'}>
        <GameCanvas canvasRef={canvasRef} label={GAME_LAYER_LABEL} />
      </Box>
      {status === 'error' && <Text className="game-layer__error" variant="body">{`${GAME_LAYER_ERROR_TITLE}: ${error ?? ''}`}</Text>}
    </Box>
  );
};

export { GameLayer };
