/* @layer shared-asset-extraction @kind logic */
import type { SteamArchive } from './steam-archive.type';

import { readBlock } from './read-block';
import { readDirectory } from './read-directory';

const readEntry = (archive: SteamArchive, entry: [number, number]): Promise<Uint8Array> =>
  readBlock(archive, entry[0], entry[1]);

export { readEntry };
