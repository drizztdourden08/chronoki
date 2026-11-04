/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { classifyCtMusic } from './classify-ct-music';
import { FRESH } from './create-msu-bridge.constants';
import { diffSong } from './diff-song';
import { CK_EXPORT_MUSIC_STATE } from './msu-bridge.constants';
import type { BridgeTrackState, MsuBridge, MsuBridgeEvent } from './music-state.type';
import { readMusicState } from './read-music-state';
import { setVoiceGains } from './set-voice-gains';

const createMsuBridge = (calls: CoreCalls, onEvent: (event: MsuBridgeEvent) => void): MsuBridge => {
  let state: BridgeTrackState = FRESH;
  const emit = (ctrl: number): void => onEvent({ ctrl, command: classifyCtMusic(ctrl) });
  const poll = (): void => {
    if (!calls.has(CK_EXPORT_MUSIC_STATE)) return;
    const snapshot = readMusicState(calls.heap(), calls.number(CK_EXPORT_MUSIC_STATE));
    if (!snapshot?.valid) return;
    const collected = diffSong(snapshot, state);
    state = collected.state;
    collected.ctrls.forEach(emit);
  };
  const setPackPlaying = (on: boolean): void => setVoiceGains(calls, on);
  const announce = (): void => {
    if (state.song !== null) emit(state.song);
  };
  const reset = (): void => {
    state = FRESH;
    setVoiceGains(calls, false);
  };
  return { poll, setPackPlaying, announce, reset };
};

export { createMsuBridge };
