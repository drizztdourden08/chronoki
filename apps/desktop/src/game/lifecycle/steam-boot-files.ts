/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { CkSettings } from '@chronoki/game-core';
import { CT_WIDE_FILE } from '@chronoki/game-core';
import { readSteamWide } from '@app/storage/steam-store/read-steam-wide';

const steamBootFiles = async (settings: CkSettings | undefined, files?: FileStore): Promise<Record<string, Uint8Array>> => {
  if (!settings?.steamMargins) return {};
  const wide = await readSteamWide(files);
  return wide ? { [CT_WIDE_FILE]: wide } : {};
};

export { steamBootFiles };
