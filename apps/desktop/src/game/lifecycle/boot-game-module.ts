/* @layer bridge-wasm @kind logic */
import type { SaveStore } from '@drizztdourden08/brock-port-kit';
import type { PortSession } from '@drizztdourden08/brock-port-kit/renderer';
import { createPortSession } from '@drizztdourden08/brock-port-kit/renderer';
import type { CkSettings } from '@chronoki/game-core';
import { CT_SRAM_FILE, DEFAULT_CK_SETTINGS, frameSizeOf, sizePortFrame } from '@chronoki/game-core';
import { prepareBootAssets } from '../randomizer/prepare-boot-assets';
import { chronokiCore } from './chronoki-core';
import { readProfileSram } from './read-profile-sram';
import { steamBootFiles } from './steam-boot-files';
import type { StartGameRequest } from './start-game.type';

const bootGameModule = async (request: StartGameRequest, store: SaveStore): Promise<PortSession<CkSettings> | null> => {
  const { canvas, files, romFile, config, settings, volume } = request;
  const sram = await readProfileSram(store.sram, request.profileId);
  const frameFiles = sizePortFrame(frameSizeOf(settings ?? DEFAULT_CK_SETTINGS));
  const steamFiles = await steamBootFiles(settings);
  const session = createPortSession<CkSettings>({
    core: chronokiCore,
    canvas,
    files,
    romFile,
    profileId: null,
    prepareAssets: (assets) => prepareBootAssets(request.profileId, assets),
    config,
    settings,
    volume,
    extraFiles: sram ? { ...frameFiles, ...steamFiles, [CT_SRAM_FILE]: sram } : { ...frameFiles, ...steamFiles },
  });
  if (await session.start()) return session;
  await session.stop();
  return null;
};

export { bootGameModule };
