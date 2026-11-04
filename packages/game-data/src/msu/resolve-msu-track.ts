/* @layer shared-game-data @kind logic */
import { MSU_IGNORED_TRACKS } from './msu-ignored-tracks.constants';
import { MSU_SILENCE_IDS } from './msu-silence-ids.constants';
import { MSU_TRACK_REMAPS } from './msu-track-remaps.constants';
import type { MsuTrackResolution } from './msu-track-resolution.type';

const resolveMsuTrack = (songId: number): MsuTrackResolution => {
  if (MSU_SILENCE_IDS.includes(songId)) return { kind: 'silence', trackNum: songId };
  if (MSU_IGNORED_TRACKS.includes(songId)) return { kind: 'ignored', trackNum: songId };
  const remap = MSU_TRACK_REMAPS.find((entry) => entry.from === songId);
  return remap ? { kind: 'track', trackNum: songId, fallback: remap.to } : { kind: 'track', trackNum: songId };
};

export { resolveMsuTrack };
