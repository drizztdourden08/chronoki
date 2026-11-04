/* @layer shared-asset-extraction @kind logic */
import { CT_ROM_NAME, CT_ROM_SHA1, ROM_WORK_PATH } from '../rom/rom.constants';
import { loadRom } from '../rom/load-rom';
import type { StageRun } from './stage.type';

const verifyRomStage: StageRun = async (ctx) => {
  ctx.rom = loadRom(ctx.rom);
  await ctx.work.writeBytes(ROM_WORK_PATH, ctx.rom);
  ctx.log(`ROM verified: ${CT_ROM_NAME}, SHA-1 ${CT_ROM_SHA1}`);
};

export { verifyRomStage };
