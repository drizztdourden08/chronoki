/* @layer renderer-appshell @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { activeGameHolder } from '@app/game/lifecycle';
import { NOTICE_NO_PROFILE, NOTICE_NO_ROM } from '../GameSession.constants';
import type { GameLaunch, GameSessionValue } from '../GameSession.type';
import { attachAudioFrameCounter } from './attach-audio-frame-counter';
import { resolveLaunch } from './resolve-launch';
import { runFunctionAction } from './run-function-action';
import { useAutoLaunch } from './useAutoLaunch';
import { useCoreSettings } from './useCoreSettings';
import { useGameProfile } from './useGameProfile';
import { useLaunchProbes } from './useLaunchProbes';

const useGameSessionValue = (): GameSessionValue => {
  const { profile, loaded } = useGameProfile();
  const core = useCoreSettings();
  const [launch, setLaunch] = useState<GameLaunch | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);

  const play = useCallback(() => {
    if (!profile) {
      setNotice(NOTICE_NO_PROFILE);
      return;
    }
    const id = counter + 1;
    setCounter(id);
    void resolveLaunch(profile, id).then((next) => {
      setNotice(next ? null : NOTICE_NO_ROM);
      setLaunch(next);
    });
  }, [profile, counter]);

  const stop = useCallback(() => setLaunch(null), []);

  const onStarted = useCallback(() => {
    const game = activeGameHolder.current;
    if (game) attachAudioFrameCounter(game.session.audio);
  }, []);

  const onFunctionAction = useCallback((action: Parameters<typeof runFunctionAction>[0]) => {
    void runFunctionAction(action);
  }, []);

  useAutoLaunch(loaded && profile !== null, play);
  useLaunchProbes(launch);

  return useMemo(
    () => ({ launch, notice, ...core, play, stop, onStarted, onFunctionAction }),
    [launch, notice, core, play, stop, onStarted, onFunctionAction],
  );
};

export { useGameSessionValue };
