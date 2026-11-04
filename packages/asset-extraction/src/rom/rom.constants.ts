/* @layer shared-asset-extraction @kind constants */
/** The one ROM supported: Chrono Trigger (USA), the No-Intro dump, headerless (ctlib/rom.py ROM_SHA1). */
const CT_ROM_SHA1 = 'DE5822F4F2F7A55ACB8926D4C0EAA63D5D989312';
const CT_ROM_CRC32 = 0x2d206bf7;
const CT_ROM_SIZE = 4 * 1024 * 1024;
const CT_ROM_NAME = 'Chrono Trigger (USA)';
const COPIER_HEADER_BYTES = 512;
/** Where setup.py copies the verified ROM, and where every tool looks for it. */
const ROM_WORK_PATH = 'Chrono_Trigger_USA_SNES.sfc';

export { COPIER_HEADER_BYTES, CT_ROM_CRC32, CT_ROM_NAME, CT_ROM_SHA1, CT_ROM_SIZE, ROM_WORK_PATH };
