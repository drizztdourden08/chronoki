/* @layer shared-asset-extraction @kind constants */

const ROM_PATH = '/Chrono_Trigger_USA_SNES.sfc';
const STATE_IN = '/in/state';
const SRAM_IN = '/in/sram.srm';
const OUT_DIR = '/out';
const RAW_OUT = '/out/raw';
const STATE_OUT = '/out/state';

const BASE_ENV: Record<string, string> = { SDL_VIDEODRIVER: 'dummy', SDL_AUDIODRIVER: 'dummy' };
const RULE_ENV: Record<string, string> = { CT_ORACLE_LOGICAL: '1' };

const NOT_ORACLE_STATUS = 97;

export { BASE_ENV, NOT_ORACLE_STATUS, OUT_DIR, RAW_OUT, ROM_PATH, RULE_ENV, SRAM_IN, STATE_IN, STATE_OUT };
