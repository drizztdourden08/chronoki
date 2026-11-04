/* @layer bridge-wasm @kind logic */
import { createCtMsuHost, createMsuBridge } from '@chronoki/game-core';
import type { MsuBridgeEvent } from '@chronoki/game-core';
import { startMsuSession } from '@drizztdourden08/brock-msu/session';
import type { MsuSession } from '@drizztdourden08/brock-msu/session';
import { appLog } from '@app/log/app-log';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { applyMusicEvent } from './apply-music-event';
import { audioTarget } from './audio-target';
import { buildSessionOptions } from './build-session-options';
import { guardBridge } from './guard-bridge';
import { loadPackManifest } from './load-pack-manifest';
import { msuLiveState } from './msu-live-state';
import { msuPlaybackAllowed } from './msu-playback-allowed';
import { msuRuntime } from './msu-runtime';
import { startPollLoop } from './start-poll-loop';
import { stopCtMsuSession } from './stop-ct-msu-session';

const startCtMsuSession = async (packName: string): Promise<boolean> => {
  stopCtMsuSession();
  const token = msuRuntime.generation;
  const live = msuLiveState.current;
  const calls = chronokiCore.calls();
  if (!live || !calls || !msuPlaybackAllowed(live.settings)) return false;
  const manifest = await loadPackManifest(packName).catch((err: unknown) => {
    appLog.error(`[MSU] Could not read pack "${packName}"`, err);
    return null;
  });
  if (!manifest || token !== msuRuntime.generation) return false;
  const tracks = new Set(manifest.tracks.map((track) => track.trackNum));
  let session: MsuSession | null = null;
  const onEvent = (event: MsuBridgeEvent): void => {
    if (session && msuRuntime.bridge) applyMusicEvent(event, session, msuRuntime.bridge, (track) => tracks.has(track));
  };
  const bridge = guardBridge(createMsuBridge(calls, onEvent));
  msuRuntime.bridge = bridge;
  session = startMsuSession(buildSessionOptions(packName, manifest, createCtMsuHost(bridge, audioTarget)));
  msuRuntime.stopPoll = startPollLoop(bridge);
  msuRuntime.packName = packName;
  bridge.announce();
  appLog.info(`[MSU] Pack "${packName}" session started`);
  return true;
};

export { startCtMsuSession };
