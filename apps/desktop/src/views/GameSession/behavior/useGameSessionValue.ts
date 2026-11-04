/* @layer renderer-appshell @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { useCoreState } from '@drizztdourden08/brock-port-kit/renderer';
import { activeGameHolder, chronokiCore } from '@app/game/lifecycle';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import { NOTICE_NO_PROFILE, NOTICE_NO_ROM } from '../GameSession.constants';
import type { GameLaunch, GameSessionValue } from '../GameSession.type';
import { attachAudioFrameCounter } from './attach-audio-frame-counter';
import { resolveLaunch } from './resolve-launch';
import { runFunctionAction } from './run-function-action';
import { runFunctionRelease } from './run-function-release';
import { useAutoLaunch } from './useAutoLaunch';
import { useCoreSettings } from './useCoreSettings';
import { useGameProfile } from './useGameProfile';
import { useHostFeatures } from './useHostFeatures';
import { useLaunchProbes } from './useLaunchProbes';
import { useSessionRecorder } from './useSessionRecorder';
import { useSyncCorePause } from './useSyncCorePause';

const useGameSessionValue = (): GameSessionValue => {
  const { profile, loaded } = useGameProfile();
  const core = useCoreSettings();
  useHostFeatures(core);
  const [launch, setLaunch] = useState<GameLaunch | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [counter, setCounter] = useState(0);
  const { status } = useCoreState(chronokiCore);
  const running = launch !== null && (status === 'running' || status === 'paused');
  const paused = status === 'paused';

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

  const reset = play;

  const togglePause = useCallback(() => getInputManager().togglePause(), []);

  const onStarted = useCallback(() => {
    const game = activeGameHolder.current;
    if (game) attachAudioFrameCounter(game.session.audio);
  }, []);

  const onFunctionAction = useCallback((action: Parameters<typeof runFunctionAction>[0]) => {
    void runFunctionAction(action);
  }, []);

  const onFunctionRelease = useCallback((action: Parameters<typeof runFunctionRelease>[0]) => runFunctionRelease(action), []);

  useAutoLaunch(loaded && profile !== null, play);
  useLaunchProbes(launch);
  useSessionRecorder(launch?.profileId ?? null, running);
  useSyncCorePause(running);

  return useMemo(
    () => ({ launch, notice, running, paused, ...core, play, stop, reset, togglePause, onStarted, onFunctionAction, onFunctionRelease }),
    [launch, notice, running, paused, core, play, stop, reset, togglePause, onStarted, onFunctionAction, onFunctionRelease],
  );
};

export { useGameSessionValue };
