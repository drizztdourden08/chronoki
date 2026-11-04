/* @layer bridge-wasm @kind types */
type CkWidescreen = 'off' | '16:9' | '16:10' | '21:9';

type CkSync = 'frame' | 'free';

interface CkSettings {
  widescreen: CkWidescreen;
  renderScale: number;
  interpolation: boolean;
  steamMargins: boolean;
  fillBottomLines: boolean;
  sceneAdjustments: boolean;
  volume: number;
  mute: boolean;
  sync: CkSync;
  instantSoundUploads: boolean;
}

export type { CkSettings, CkSync, CkWidescreen };
