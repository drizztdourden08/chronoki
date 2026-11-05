/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { CtOptionValues, CtPlacement } from '@chronoki/game-core';
import { roomCacheFile } from '@app/profiles/storage';

type RoomCache = { placement: CtPlacement; options: CtOptionValues };

const isRoomCache = (raw: unknown): raw is RoomCache => {
  if (typeof raw !== 'object' || raw === null) return false;
  const { placement, options } = raw as Partial<RoomCache>;
  return typeof options === 'object' && options !== null && typeof placement === 'object' && placement !== null
    && typeof placement.seed === 'string' && Array.isArray(placement.locations);
};

const readRoomCache = async (files: FileStore, profileId: string): Promise<RoomCache | null> => {
  try {
    const text = await files.readText(roomCacheFile(profileId));
    const raw: unknown = text === null ? null : JSON.parse(text);
    return isRoomCache(raw) ? raw : null;
  } catch {
    return null;
  }
};

const writeRoomCache = async (files: FileStore, profileId: string, cache: RoomCache): Promise<void> => {
  await files.mkdir(`profiles/${profileId}/archipelago`);
  await files.writeText(roomCacheFile(profileId), JSON.stringify(cache));
};

export { readRoomCache, writeRoomCache };
export type { RoomCache };
