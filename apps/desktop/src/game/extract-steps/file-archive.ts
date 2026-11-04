/* @layer bridge-wasm @kind logic */
import type { SteamArchive } from '@chronoki/asset-extraction';

const fileArchive = (file: File): SteamArchive => ({
  read: async (offset, length) => new Uint8Array(await file.slice(offset, offset + length).arrayBuffer()),
});

export { fileArchive };
