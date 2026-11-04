/* @layer renderer-lib @kind constants */
const MSU_PACK_ROOT = 'msu';
const CLASSIC_TRACK_PATTERN = /\.(pcm|opuz|msu)$/i;
const NO_TRACKS_ERROR = 'No audio tracks (.pcm, .opuz or .msu) were found in the source. This may be a patch file, not an MSU audio pack.';
const DEFAULT_PACK_NAME = 'Music pack';
const ZIP_MAGIC = [0x50, 0x4b] as const;

export { CLASSIC_TRACK_PATTERN, DEFAULT_PACK_NAME, MSU_PACK_ROOT, NO_TRACKS_ERROR, ZIP_MAGIC };
