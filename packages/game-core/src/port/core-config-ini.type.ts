/* @layer bridge-wasm @kind types */
import type { CkDialogPacing } from './dialog-pacing/dialog-pacing.type';

type CkWidescreen = 'off' | '16:9' | '16:10' | '21:9';

type CkSync = 'frame_perfect' | 'free';

interface CkSettings {
  widescreen: CkWidescreen;
  wideWidth: number;
  tallLines: number;
  cameraLock: boolean;
  renderScale: number;
  interpolation: boolean;
  steamMargins: boolean;
  fillBottomLines: boolean;
  sceneAdjustments: boolean;
  volume: number;
  mute: boolean;
  sync: CkSync;
  instantSoundUploads: boolean;
  sightscope: boolean;
  visibleTechs: boolean;
  dimFlashes: boolean;
  dialogControls: boolean;
  dialogPacing: CkDialogPacing;
}

type CkGameFlags = { randomizer: boolean; disableGlitches: boolean; duplicateCharacters?: boolean };

export type { CkGameFlags, CkSettings, CkSync, CkWidescreen };
