/* @layer renderer-appshell @kind hook */
import { useEffect, useRef } from 'react';
import { useCoreState } from '@drizztdourden08/brock-port-kit/renderer';
import { chronokiCore } from '@app/game/lifecycle';
import type { GameLaunch } from '../GameSession.type';
import { runLaunchProbes } from './run-launch-probes';

const useLaunchProbes = (launch: GameLaunch | null): void => {
  const { status } = useCoreState(chronokiCore);
  const handled = useRef<number | null>(null);

  useEffect(() => {
    if (launch === null || handled.current === launch.id) return;
    if (status !== 'running' && status !== 'error') return;
    handled.current = launch.id;
    void runLaunchProbes();
  }, [launch, status]);
};

export { useLaunchProbes };
