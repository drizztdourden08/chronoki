/* @layer bridge-wasm @kind logic */
import { packRomSpans } from '../../randomizer/apply/enemy-table/pack-rom-spans';
import { LOCATION_NO_SONG_BIT, LOCATION_RECORD_BYTES, LOCATION_RECORDS_ROM } from './alt-music.constants';
import type { SongPlan } from './alt-music.type';

const planRecordSong = (pack: Uint8Array, location: number, song: number): SongPlan => {
  const at = packRomSpans(pack, LOCATION_RECORDS_ROM + location * LOCATION_RECORD_BYTES, 1)[0];
  const old = at === undefined ? undefined : pack[at];
  if (at === undefined || old === undefined) return { edit: null, failed: `location ${location}: record not in the pack` };
  if ((old & LOCATION_NO_SONG_BIT) !== 0) return { edit: null, failed: `location ${location}: record has no song` };
  return { edit: { at, old, next: song, why: `location ${location} song ${old} to ${song}` }, failed: null };
};

export { planRecordSong };
