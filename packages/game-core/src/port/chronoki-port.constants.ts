/* @layer bridge-wasm @kind constants */
import type { CoreDefinition } from '@drizztdourden08/brock-port-kit';

const CHRONOKI_PORT_ID = 'chronoki';

const CT_ROM_SHA1 = 'de5822f4f2f7a55acb8926d4c0eaa63d5d989312';
const CT_ROM_KIND = 'ct-usa';
const CT_ROM_LABEL = 'Chrono Trigger (USA)';
const COPIER_HEADER_BYTES = 512;
const COPIER_HEADER_MODULO = 1024;

const CT_FRAME_WIDTH = 256;
const CT_FRAME_HEIGHT = 224;
const CT_SAMPLE_RATE = 48000;
const CT_QUICK_SLOTS = 12;
const SRAM_SYNC_MS = 5000;
const CRASH_ARM_DELAY_MS = 200;

const CT_SRAM_FILE = '/saves/ct_sram.srm';
const CT_ASSETS_FILE = '/ct_assets.dat';
const CT_SETTINGS_FILE = '/ct_settings.ini';
const CT_STATE_FILE = '/ct_debug.state';
const CT_STATE_APU_FILE = '/ct_debug.state.apu';
const CT_SCRATCH_SLOT = 0;

const CHRONOKI_CORE: CoreDefinition = {
  glue: './wasm/chronoki.js',
  wasm: 'wasm/chronoki.wasm',
  factory: 'Chronoki',
  files: {
    assets: CT_ASSETS_FILE,
    config: CT_SETTINGS_FILE,
    sram: CT_SRAM_FILE,
    state: CT_STATE_FILE,
    scratchSlot: CT_SCRATCH_SLOT,
  },
  exports: {
    stop: 'CkStop',
    pause: 'CkSetPaused',
    runFrame: 'CkRunFrame',
    setInput: 'CkSetInput',
    saveSram: 'CkSaveSram',
    saveState: 'CkSaveState',
    loadState: 'CkLoadState',
  },
};

export {
  CHRONOKI_CORE, CHRONOKI_PORT_ID, COPIER_HEADER_BYTES, COPIER_HEADER_MODULO, CRASH_ARM_DELAY_MS, CT_ASSETS_FILE,
  CT_FRAME_HEIGHT, CT_FRAME_WIDTH, CT_QUICK_SLOTS, CT_ROM_KIND, CT_ROM_LABEL, CT_ROM_SHA1, CT_SAMPLE_RATE,
  CT_SETTINGS_FILE, CT_SRAM_FILE, CT_STATE_APU_FILE, CT_STATE_FILE, SRAM_SYNC_MS,
};
