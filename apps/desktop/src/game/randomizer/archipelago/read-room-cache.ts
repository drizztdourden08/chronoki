/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { roomCacheFile } from '@app/profiles/storage';
import type { CtPlacement } from '@chronoki/game-core';
import type { RoomCache } from './room-cache.type';

const isRoomCache = (raw: unknown): raw is RoomCache => {
  if (typeof raw !== 'object' || raw === null) return false;
  const { placement, options } = raw as { placement?: Partial<CtPlacement> | null; options?: unknown };
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

export { readRoomCache };
