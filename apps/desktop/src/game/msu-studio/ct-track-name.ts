/* @layer bridge-wasm @kind logic */
import { MSU_TRACK_LABELS } from '@chronoki/game-data';

const ctTrackName = (trackNum: number): string => MSU_TRACK_LABELS[trackNum] ?? `Track ${trackNum}`;

export { ctTrackName };
