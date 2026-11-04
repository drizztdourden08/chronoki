/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useProduct } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { HeroTools } from '@app/compounds/ProfileHero';
import { HubGameControls } from '@app/compounds/HubGameControls';
import { useGateMode } from '@app/settings-controls/useGateMode';
import { useGameSession } from '@app/views/GameSession';
import { HomeDialogs, MODE_LABELS, buildProfileFacts, romFileOf, useHomeSramImport, useRevealProfileFolder } from '@app/views/HomeTab';

const meta: ScreenMeta = {
  title: 'Home',
  icon: 'house',
  keywords: ['play', 'start', 'stop', 'reset', 'saves', 'quick save', 'auto save', 'import save'],
  hero: { size: 'compact' },
};

const HomeHero = (props: HeroProps) => {
  const { slots, profile } = props;
  const { Eyebrow, Title, Art, Tools, Actions, Facts } = slots;
  const product = useProduct();
  const mode = useGateMode();
  const { running, paused, play, stop, reset, togglePause } = useGameSession();
  const profileId = profile?.id ?? null;
  const { reveal, canReveal } = useRevealProfileFolder(profileId);
  const sramImport = useHomeSramImport(profileId);
  const romFile = romFileOf(profile);
  const facts = useMemo(
    () => buildProfileFacts({ romFile, lastPlayed: profile?.lastPlayed, created: profile?.created }),
    [romFile, profile?.lastPlayed, profile?.created],
  );

  return (
    <>
      <Eyebrow>Mode</Eyebrow>
      <Title>{MODE_LABELS[mode]}</Title>
      <Art kind="image" src={product.logos.mark} alt="" />
      <Actions>
        <HubGameControls
          isGameRunning={running}
          isPaused={paused}
          showPlay
          size="md"
          onStartGame={play}
          onStopGame={stop}
          onResetGame={reset}
          onTogglePause={togglePause}
        />
      </Actions>
      <Tools>
        <HeroTools canRevealFolder={canReveal} importDisabled={running || profileId === null} onOpenFolder={reveal} onImportSram={() => void sramImport.pick()} />
      </Tools>
      <Facts rows={facts} />
      <HomeDialogs sramImport={sramImport} />
    </>
  );
};

export default HomeHero;
export { meta };
