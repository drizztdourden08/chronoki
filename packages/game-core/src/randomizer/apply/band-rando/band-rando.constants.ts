/* @layer bridge-wasm @kind constants */
import type { Band } from './band-rando.type';

const GEAR_BAND: Band = { min: 0.75, max: 1.25 };
const HEAL_BAND: Band = { min: 0.5, max: 1.5 };
const TECH_BAND: Band = { min: 0.5, max: 1.5 };
const BYTE_MAX = 0xff;

export { BYTE_MAX, GEAR_BAND, HEAL_BAND, TECH_BAND };
