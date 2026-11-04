/* @layer bridge-wasm @kind logic */
import type { MsuLive } from './msu-session.type';

const msuLiveState: { current: MsuLive | null } = { current: null };

export { msuLiveState };
