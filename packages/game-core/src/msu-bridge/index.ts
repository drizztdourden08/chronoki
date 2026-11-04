/* @layer bridge-wasm @kind barrel */
export { createMsuBridge } from './create-msu-bridge';
export { createCtMsuHost } from './create-ct-msu-host';
export { ctMsuConfig } from './ct-msu-config';
export { ctSidecarPath } from './ct-sidecar-path';
export { ctSaveCompanions } from './ct-save-companions';
export { slotRefOf } from './slot-ref-of';
export { classifyCtMusic } from './classify-ct-music';
export { diffSong } from './diff-song';
export { readMusicState } from './read-music-state';
export { setVoiceGains } from './set-voice-gains';
export { CK_EXPORT_MUSIC_STATE, CK_EXPORT_SET_VOICE_GAINS, FADE_CTRL_BASE } from './msu-bridge.constants';
export type {
  BridgeTrackState, MsuBridge, MsuBridgeEvent, MusicStateSnapshot, RawMusicCommand,
} from './music-state.type';
