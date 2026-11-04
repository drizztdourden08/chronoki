/* @layer bridge-wasm @kind types */
import type { MusicCommand } from '@drizztdourden08/brock-msu';

interface RawMusicCommand {
  cmd: number;
  p1: number;
  p2: number;
  p3: number;
  frame: number;
}

interface MusicStateSnapshot {
  seq: number;
  dropped: number;
  song: number;
  sfxVoices: number;
  fade: number;
  valid: boolean;
  commands: readonly RawMusicCommand[];
}

interface BridgeTrackState {
  song: number | null;
  fade: number | null;
}

interface MsuBridgeEvent {
  ctrl: number;
  command: MusicCommand;
}

interface MsuBridge {
  poll: () => void;
  setPackPlaying: (on: boolean) => void;
  announce: () => void;
  reset: () => void;
}

export type { BridgeTrackState, MsuBridge, MsuBridgeEvent, MusicStateSnapshot, RawMusicCommand };
