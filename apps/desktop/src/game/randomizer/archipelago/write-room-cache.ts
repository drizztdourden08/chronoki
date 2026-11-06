/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { roomCacheFile } from '@app/profiles/storage';
import type { RoomCache } from './room-cache.type';

const writeRoomCache = async (files: FileStore, profileId: string, cache: RoomCache): Promise<void> => {
  await files.mkdir(`profiles/${profileId}/archipelago`);
  await files.writeText(roomCacheFile(profileId), JSON.stringify(cache));
};

export { writeRoomCache };
