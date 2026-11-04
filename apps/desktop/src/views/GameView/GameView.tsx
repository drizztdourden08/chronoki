/* @layer renderer-components @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { GameLayer } from '@app/views/GameLayer';
import { useGameSession } from '@app/views/GameSession';
import './GameView.css';

const GameView = () => {
  const { launch, notice, play } = useGameSession();
  return (
    <Box className="game-view">
      <GameLayer />
      {launch === null && (
        <Box className="game-view__play">
          <Button variant="primary" onClick={play}>Play</Button>
          {notice && <Text variant="body">{notice}</Text>}
        </Box>
      )}
    </Box>
  );
};

export { GameView };
