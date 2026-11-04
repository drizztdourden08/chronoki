/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useProduct } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { HeroLastSaveTile, HeroTools } from '@app/compounds/ProfileHero';
import { HubGameControls } from '@app/compounds/HubGameControls';
import { useGateMode } from '@app/settings-controls/useGateMode';
import { useGameSession } from '@app/views/GameSession';
import { HomeDialogs, HomeTab, MODE_LABELS, buildProfileFacts, romFileOf, useHomeSramImport, useNormalSaves, useRevealProfileFolder } from '@app/views/HomeTab';

const meta: ScreenMeta = {
  title: 'Home',
  icon: 'house',
  keywords: ['play', 'start', 'stop', 'reset', 'saves', 'quick save', 'auto save', 'import save'],
  hero: { size: 'compact' },
};

const HomeHero = (props: HeroProps) => {
  const { slots, profile } = props;
  const { Eyebrow, Title, Art, Tools, Actions, Facts, Aside } = slots;
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

  const normal = useNormalSaves(profileId, running);
  const lastSave = useMemo(() => {
    const latest = normal.saves[0];
    if (!latest) return null;
    return {
      name: latest.name,
      timestamp: latest.savedAt,
      screenshotUrl: normal.screenshots[latest.id] ?? null,
      busy: normal.busyId === latest.id,
      onLoad: () => void normal.load(latest.id),
    };
  }, [normal]);

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
      {lastSave && <Aside><HeroLastSaveTile save={lastSave} /></Aside>}
      <HomeTab profileId={profileId} running={running} normal={normal} />
      <HomeDialogs sramImport={sramImport} />
    </>
  );
};

export default HomeHero;
export { meta };
