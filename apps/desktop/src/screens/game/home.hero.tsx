/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useAppVersion, useProduct } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { Button, Text } from '@drizztdourden08/tessera/primitives';
import { ModeBadge } from '@chronoki/design';
import { HubGameControls } from '@app/compounds/HubGameControls';
import { useGateMode } from '@app/settings-controls/useGateMode';
import { useGameSession } from '@app/views/GameSession';

const meta: ScreenMeta = { title: 'Home', icon: 'house', keywords: ['start', 'overview', 'profile'] };

const HomeHero = (props: HeroProps) => {
  const { slots, profile, open } = props;
  const { Eyebrow, Title, Art, Tools, Actions, Facts, Aside } = slots;
  const product = useProduct();
  const version = useAppVersion();
  const mode = useGateMode();
  const { running, paused, play, stop, reset, togglePause } = useGameSession();
  const facts = useMemo(() => [[
    { label: 'Profile', value: profile?.name ?? 'None' },
    { label: 'Version', value: version, mono: true },
  ]], [profile, version]);

  return (
    <>
      <Eyebrow>Home</Eyebrow>
      <Title>{product.name}</Title>
      <Art kind="image" src={product.logos.mark} alt="" />
      <Tools>
        <ModeBadge mode={mode} />
        <Button size="sm" variant="secondary" onClick={() => open('profiles')}>Profiles</Button>
      </Tools>
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
      <Facts rows={facts} />
      <Aside>
        <Text variant="body">Chrono Trigger on your computer and phone. Add your own ROM in the Library to begin.</Text>
      </Aside>
    </>
  );
};

export default HomeHero;
export { meta };
