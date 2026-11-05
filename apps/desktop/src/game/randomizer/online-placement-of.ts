/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { OnlineConnection } from '@drizztdourden08/brock-randomizer/archipelago';
import { readRoomCache, writeRoomCache } from './archipelago/room-cache';
import type { RoomCache } from './archipelago/room-cache';
import { scoutRoom } from './archipelago/scout-room';
import { appRandomizerLog } from '@drizztdourden08/brock-randomizer/renderer';

const onlinePlacementOf = async (profileId: string, connection: OnlineConnection, files: FileStore): Promise<RoomCache | null> => {
  try {
    const room = await scoutRoom(connection);
    await writeRoomCache(files, profileId, room);
    return room;
  } catch (error) {
    const cached = await readRoomCache(files, profileId);
    appRandomizerLog(`The room could not be scouted (${error instanceof Error ? error.message : String(error)}); ${cached === null ? 'no saved copy' : 'using the saved copy'}.`);
    return cached;
  }
};

export { onlinePlacementOf };
