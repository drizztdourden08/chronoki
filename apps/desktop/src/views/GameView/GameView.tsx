/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { useProduct } from '@drizztdourden08/brock-react';
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { GameLayer } from '@app/views/GameLayer';
import { useGameSession } from '@app/views/GameSession';
import { PauseLayer } from '@app/views/PauseLayer';
import { ProfileSwitcherOverlay } from '@app/views/ProfileSwitcherOverlay';
import { DebugFloatingControls } from '@app/compounds/DebugFloatingControls';
import { LocationBannerLayer } from '@app/views/LocationBannerLayer';
import { RandomizerOverlays } from '@app/views/RandomizerOverlays';
import { SaveStateOverlay, useSaveOverlay } from '@app/views/SaveStateOverlay';
import { useDockBleed } from './behavior/useDockBleed';
import './GameView.css';

const GameView = () => {
  const { launch, notice, running } = useGameSession();
  const product = useProduct();
  const saveOverlay = useSaveOverlay();
  const viewRef = useRef<HTMLDivElement | null>(null);
  const profileId = launch?.profileId ?? null;
  useDockBleed(viewRef);
  return (
    <Box ref={viewRef} className="game-view">
      <GameLayer />
      <SaveStateOverlay
        open={saveOverlay.open}
        onClose={saveOverlay.close}
        profileId={profileId}
        highlightedSlot={saveOverlay.highlightedSlot}
        holdProgress={saveOverlay.holdProgress}
        hints={saveOverlay.hints}
      />
      <DebugFloatingControls profileId={profileId} gameRunning={running} />
      {running && <PauseLayer />}
      {running && <ProfileSwitcherOverlay />}
      {running && <LocationBannerLayer />}
      {running && <RandomizerOverlays profileId={profileId} />}
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
