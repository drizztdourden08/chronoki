/* @layer bridge-wasm @kind constants */
import type { CkSettings } from './core-config-ini.type';
import { definePort } from '@drizztdourden08/brock-port-kit';
import {
  CHRONOKI_CORE, CHRONOKI_PORT_ID, CT_FRAME_HEIGHT, CT_FRAME_WIDTH, CT_QUICK_SLOTS, CT_ROM_KIND, CT_ROM_LABEL,
  CT_ROM_SHA1, CT_SAMPLE_RATE, SRAM_SYNC_MS,
} from './chronoki-port.constants';
import { stripCopierHeader } from './strip-copier-header';

const CHRONOKI_PORT = definePort<CkSettings>({
  id: CHRONOKI_PORT_ID,
  core: CHRONOKI_CORE,
  rom: {
    extensions: ['.sfc', '.smc'],
    known: { [CT_ROM_SHA1]: { id: CT_ROM_KIND, label: CT_ROM_LABEL } },
    normalize: stripCopierHeader,
    keepFileName: true,
  },
  video: { mode: 'framebuffer', width: CT_FRAME_WIDTH, height: CT_FRAME_HEIGHT, frame: 'CkFramePtr', fps: 60 },
  audio: { mode: 'samples', sampleRate: CT_SAMPLE_RATE, channels: 2, samples: 'CkSamplesPtr', count: 'CkSampleCount' },
  saves: { quickSlots: CT_QUICK_SLOTS, sramSyncMs: SRAM_SYNC_MS },
  settings: { apply: () => undefined },
  assets: { extension: '.dat', extractors: [] },
});

export { CHRONOKI_PORT };
