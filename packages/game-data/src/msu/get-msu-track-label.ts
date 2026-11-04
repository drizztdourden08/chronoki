/* @layer shared-game-data @kind logic */
import { MSU_TRACK_LABELS } from './msu-track-labels.constants';

const getMsuTrackLabel = (trackNum: number): string => {
  const label = MSU_TRACK_LABELS[trackNum];
  return label ? `Track ${trackNum} · ${label}` : `Track ${trackNum}`;
};

export { getMsuTrackLabel };
