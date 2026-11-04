/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { useProduct } from '@drizztdourden08/brock-react';
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { GameLayer } from '@app/views/GameLayer';
import { useGameSession } from '@app/views/GameSession';
import { PauseOverlay } from '@app/views/PauseOverlay';
import { ProfileSwitcherOverlay } from '@app/views/ProfileSwitcherOverlay';
import { DebugFloatingControls } from '@app/compounds/DebugFloatingControls';
import { SaveStateOverlay } from '@app/views/SaveStateOverlay';
import { useDockBleed } from './behavior/useDockBleed';
import './GameView.css';

const GameView = () => {
  const { launch, notice, running } = useGameSession();
  const product = useProduct();
  const viewRef = useRef<HTMLDivElement | null>(null);
  useDockBleed(viewRef);
  return (
    <Box ref={viewRef} className="game-view">
      <GameLayer />
      {running && <SaveStateOverlay />}
      <DebugFloatingControls profileId={launch?.profileId ?? null} gameRunning={running} />
      {running && <PauseOverlay />}
      {running && <ProfileSwitcherOverlay />}
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
