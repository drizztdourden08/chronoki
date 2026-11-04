/* @layer bridge-wasm @kind logic */
import { FADE_CTRL_BASE } from './msu-bridge.constants';
import { ctrlOfCommand } from './ct-music-ctrl';
import type { BridgeTrackState, MusicStateSnapshot } from './music-state.type';

interface CollectedMusic {
  ctrls: readonly number[];
  state: BridgeTrackState;
}

const playCtrls = (snapshot: MusicStateSnapshot): number[] =>
  snapshot.commands.map(ctrlOfCommand).filter((ctrl): ctrl is number => ctrl !== null);

const diffSong = (snapshot: MusicStateSnapshot, prev: BridgeTrackState): CollectedMusic => {
  const ctrls = playCtrls(snapshot);
  if (snapshot.song !== prev.song && !ctrls.includes(snapshot.song)) ctrls.push(snapshot.song);
  if (prev.fade !== null && snapshot.fade !== prev.fade) ctrls.push(FADE_CTRL_BASE + snapshot.fade);
  return { ctrls, state: { song: snapshot.song, fade: snapshot.fade } };
};

export { diffSong };
export type { CollectedMusic };
