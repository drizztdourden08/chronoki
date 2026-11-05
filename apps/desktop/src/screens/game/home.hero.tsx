/* @layer renderer-app @kind component */
import { useMemo } from 'react';
import { useProduct, useSettings } from '@drizztdourden08/brock-react';
import type { HeroProps, ScreenMeta } from '@drizztdourden08/brock-react';
import { HeroLastSaveTile, HeroProgress, HeroTools } from '@app/compounds/ProfileHero';
import { HubGameControls } from '@app/compounds/HubGameControls';
import { MODE_BADGE_LABELS } from '@app/compounds/ModeBadge';
import { modeOf } from '@app/profile-modes';
import type { AppSettings } from '@app/settings.type';
import { GamePendulum } from './game.pendulum';
import { useGameSession } from '@app/views/GameSession';
import { HomeDialogs, HomeTab, buildProfileFacts, romFileOf, useHomeSramImport, useNormalSaves, useProfileProgress, useRevealProfileFolder } from '@app/views/HomeTab';

const meta: ScreenMeta = {
  title: 'Home',
  icon: 'house',
  keywords: ['play', 'start', 'stop', 'reset', 'saves', 'quick save', 'auto save', 'import save', 'play sessions', 'progress'],
  hero: { size: 'compact' },
};

const HomeHero = (props: HeroProps) => {
  const { slots, profile } = props;
  const { Eyebrow, Title, Backdrop, Art, Tools, Actions, Facts, Aside, Panel } = slots;
  const product = useProduct();
  const { settings } = useSettings<AppSettings>();
  const mode = profile ? modeOf(profile, settings) : 'vanilla';
  const { running, paused, play, stop, reset, togglePause } = useGameSession();
  const profileId = profile?.id ?? null;
  const { reveal, canReveal } = useRevealProfileFolder(profileId);
  const sramImport = useHomeSramImport(profileId);
  const romFile = romFileOf(profile);
  const backdrop = useMemo(() => <GamePendulum key={romFile ?? ''} romFile={romFile} />, [romFile]);
  const facts = useMemo(
    () => buildProfileFacts({ romFile, lastPlayed: profile?.lastPlayed, created: profile?.created }),
    [romFile, profile?.lastPlayed, profile?.created],
  );

  const progress = useProfileProgress(profileId, running);
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

  if (!profile) return null;

  return (
    <>
      <Eyebrow>Mode</Eyebrow>
      <Title>{MODE_BADGE_LABELS[mode]}</Title>
      <Backdrop kind="node" node={backdrop} />
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
      {progress && <Panel><HeroProgress files={progress} /></Panel>}
      <HomeTab profileId={profileId} running={running} normal={normal} />
      <HomeDialogs sramImport={sramImport} />
    </>
  );
};

export default HomeHero;
export { meta };
