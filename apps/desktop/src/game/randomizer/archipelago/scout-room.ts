/* @layer bridge-wasm @kind logic */
import { createArchipelagoClient } from '@drizztdourden08/brock-randomizer/archipelago';
import type { OnlineConnection, OnlineHost } from '@drizztdourden08/brock-randomizer/archipelago';
import { createMemoryApStateStore, createReceivedQueue } from '@drizztdourden08/brock-randomizer/session';
import type { CtOptionValues, CtPlacement } from '@chronoki/game-core';
import { parseCtSlotData } from '@chronoki/game-core/archipelago';
import { chronokiApSlot } from './chronoki-ap-slot';
import { chronokiApLocationKeyOf } from './chronoki-ap-location-key-of';
import type { RoomCache } from './room-cache.type';
import { SCOUT_TIMEOUT_MS } from './scout-room.constants';

const idleHost: OnlineHost = {
  arm: () => undefined,
  disarm: () => undefined,
  armScouted: () => new Set<number>(),
  deliver: () => 'not-ready',
  cancelDeliveries: () => undefined,
  onDeliveryReady: () => () => undefined,
  isFileInPlay: () => false,
  onSaveSwap: () => () => undefined,
  goalReached: () => false,
  startPolling: () => undefined,
  pausePolling: () => undefined,
  readCursor: () => null,
  writeCursor: () => undefined,
  markCollected: () => undefined,
  setDeathLink: () => undefined,
  killLink: () => 'unsupported',
  onLinkDied: () => () => undefined,
};

const scoutRoom = (connection: OnlineConnection): Promise<RoomCache> =>
  new Promise((resolve, reject) => {
    let options: CtOptionValues = {};
    const client = createArchipelagoClient({
      game: 'ChronoKi',
      host: idleHost,
      received: createReceivedQueue({ store: createMemoryApStateStore(), roomHash: () => '' }),
      slot: (raw) => {
        const parsed = parseCtSlotData(raw);
        if (parsed.kind === 'ok') options = parsed.data.options;
        return chronokiApSlot(raw);
      },
      locationKeyOf: chronokiApLocationKeyOf,
      placed: (placement) => {
        clearTimeout(timer);
        stop();
        client.close();
        resolve({ placement: placement as CtPlacement, options });
      },
    });
    const stop = client.onEvent((event) => {
      if (event.type !== 'disconnected') return;
      clearTimeout(timer);
      stop();
      reject(new Error(event.reason));
    });
    const timer = setTimeout(() => {
      stop();
      client.close();
      reject(new Error('The Archipelago room did not answer in time.'));
    }, SCOUT_TIMEOUT_MS);
    client.connect({ ...connection, trackOtherPlayers: false });
  });

export { scoutRoom };
