/* @layer shared-game-data @kind constants */
import { MSU_TRACK_COUNT } from './msu-track-count.constants';
import { MSU_USED_TRACKS } from './msu-used-tracks.constants';

const MSU_UNUSED_TRACKS: readonly number[] = Array.from({ length: MSU_TRACK_COUNT }, (_, i) => i + 1).filter(
  (id) => !MSU_USED_TRACKS.includes(id),
);

export { MSU_UNUSED_TRACKS };
