/* @layer bridge-wasm @kind constants */
import type { MsuSoundChannel } from '@drizztdourden08/brock-msu';

const CT_MSU_GAME_ID = 'chrono-trigger';
const CT_MSU_PACK_ROOT = 'msu';
const CT_MSU_SOUND_CHANNELS: readonly MsuSoundChannel[] = [];
const CT_MSU_SOUND_ID_COUNT = 48;
const CT_MSU_RESUME_SUFFIX = '.msu.json';
const CT_SAVE_EXTENSION_PATTERN = /\.sav$/;

export { CT_MSU_GAME_ID, CT_MSU_PACK_ROOT, CT_MSU_RESUME_SUFFIX, CT_SAVE_EXTENSION_PATTERN, CT_MSU_SOUND_CHANNELS, CT_MSU_SOUND_ID_COUNT };
