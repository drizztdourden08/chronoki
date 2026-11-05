/* @layer bridge-wasm @kind logic */
import type { ApStateStore } from '@drizztdourden08/brock-randomizer/session';
import { apCall } from './ap-call';
import { apNumber } from './ap-number';
import {
  CK_AP_GET_RECEIVED_INDEX, CK_AP_GET_ROOM_HASH, CK_AP_SET_RECEIVED_INDEX, CK_AP_SET_ROOM_HASH, NO_ROOM,
} from './chronoki-ap-state-store.constants';

const memory = { receivedIndex: 0, roomHash: NO_ROOM };

const roomHashText = (hash: number): string => (hash === NO_ROOM ? '' : String(hash));

const chronokiApStateStore: ApStateStore = {
  read: () => ({
    receivedIndex: apNumber(CK_AP_GET_RECEIVED_INDEX) ?? memory.receivedIndex,
    roomHash: roomHashText((apNumber(CK_AP_GET_ROOM_HASH) ?? memory.roomHash) >>> 0),
  }),
  write: ({ receivedIndex, roomHash }) => {
    memory.receivedIndex = receivedIndex;
    apCall(CK_AP_SET_RECEIVED_INDEX, receivedIndex);
    const hash = roomHash === '' ? NO_ROOM : Number(roomHash);
    if (!Number.isFinite(hash)) return;
    memory.roomHash = hash;
    apCall(CK_AP_SET_ROOM_HASH, hash);
  },
};

export { chronokiApStateStore };
