/* @layer bridge-wasm @kind logic */
import type { MsuHost, MsuPackManifest } from '@drizztdourden08/brock-msu';
import type { MsuSessionOptions } from '@drizztdourden08/brock-msu/session';
import { ctMsuConfig } from '@chronoki/game-core';
import { appLog } from '@app/log/app-log';
import { groupVolume } from './group-volume';
import { msuLiveState } from './msu-live-state';
import { readTrackBytes } from './read-track-bytes';

const buildSessionOptions = (packName: string, manifest: MsuPackManifest, host: MsuHost): MsuSessionOptions => {
  const music = (): number => groupVolume((s) => (s.musicMuted ? 0 : s.musicVolume));
  return {
    config: ctMsuConfig,
    host,
    manifest,
    loadBytes: (fileName) => readTrackBytes(packName, fileName),
    musicVolume: music,
    sfxVolume: () => groupVolume((s) => (s.sfxMuted ? 0 : s.sfxVolume)),
    ambientVolume: music,
    resumeEnabled: () => msuLiveState.current?.settings.resumeMSU ?? false,
    resetAtTitle: () => msuLiveState.current?.settings.resetMSUAtTitle ?? false,
    replaceAmbient: false,
    replaceSfx: false,
    log: { info: (message) => appLog.info(message), error: (message) => appLog.error(message) },
  };
};

export { buildSessionOptions };
