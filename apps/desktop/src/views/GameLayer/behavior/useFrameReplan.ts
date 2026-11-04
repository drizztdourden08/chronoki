/* @layer renderer-components @kind hook */
import { useEffect, useRef, useState } from 'react';
import { useCoreState } from '@drizztdourden08/brock-port-kit/renderer';
import { toast } from '@drizztdourden08/tessera/composites';
import { chronokiCore, replanGame } from '@app/game/lifecycle';
import { isStateAvailable } from '@app/game/save-states';
import { readCoreStamp } from '@app/game/state-stamp';
import { REPLAN_RESCUE_TOAST } from '../GameLayer.constants';
import type { DeferredReplan, FrameReplanArgs } from '../GameLayer.type';
import { frameKeyOf } from './frame-key-of';
import { replanDecision } from './replan-decision';
import { replanDelay } from './replan-delay';

const useFrameReplan = ({ booted, planned, volume, onReplanned }: FrameReplanArgs): void => {
  const { status } = useCoreState(chronokiCore);
  const busy = useRef(false);
  const [deferred, setDeferred] = useState<DeferredReplan | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);
  const runningFrame = booted ? frameKeyOf(booted.settings) : null;
  const plannedFrame = frameKeyOf(planned.settings);

  useEffect(() => {
    if (!booted || runningFrame === null) return undefined;
    const defer = (): void => setDeferred((last) => ({ frame: plannedFrame, tick: (last?.tick ?? 0) + 1 }));
    const run = (): void => {
      const verdict = replanDecision({
        live: status === 'running', busy: busy.current, runningFrame, plannedFrame, blockedFrame: blocked,
        savable: isStateAvailable(chronokiCore), mode: readCoreStamp(chronokiCore)?.mode ?? null,
      });
      if (verdict === 'defer') defer();
      if (verdict !== 'replan') return;
      busy.current = true;
      void replanGame({ from: booted, to: planned, volume }).then((outcome) => {
        busy.current = false;
        if (outcome.kind === 'deferred') defer();
        if (outcome.kind === 'deferred' || outcome.kind === 'lost') return;
        if (outcome.kind !== 'done') setBlocked(plannedFrame);
        if (outcome.kind === 'rescued') toast({ message: REPLAN_RESCUE_TOAST, variant: 'danger' });
        onReplanned(outcome.kind === 'done' ? planned : booted);
      });
    };
    const timer = window.setTimeout(run, replanDelay(deferred?.frame ?? null, plannedFrame));
    return () => window.clearTimeout(timer);
  }, [booted, planned, runningFrame, plannedFrame, status, deferred, blocked, volume, onReplanned]);
};

export { useFrameReplan };
