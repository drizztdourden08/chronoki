/* @layer renderer-components @kind component */
import { useProduct } from '@drizztdourden08/brock-react';
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { GameLayer } from '@app/views/GameLayer';
import { useGameSession } from '@app/views/GameSession';
import { PauseOverlay } from '@app/views/PauseOverlay';
import { ProfileSwitcherOverlay } from '@app/views/ProfileSwitcherOverlay';
import { SaveStateOverlay } from '@app/views/SaveStateOverlay';
import './GameView.css';

const GameView = () => {
  const { launch, notice, running } = useGameSession();
  const product = useProduct();
  return (
    <Box className="game-view">
      <GameLayer />
      {running && <SaveStateOverlay />}
      {launch === null && (
        <Box className="game-view__idle">
          <Image className="game-view__mark" src={product.logos.mark} alt="" />
          {notice && <Text variant="body">{notice}</Text>}
        </Box>
      )}
    </Box>
  );
};

export { GameView };
