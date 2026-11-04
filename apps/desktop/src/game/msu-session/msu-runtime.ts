/* @layer bridge-wasm @kind logic */
import type { MsuRuntime } from './msu-session.type';

const msuRuntime: MsuRuntime = { generation: 0, bridge: null, stopPoll: null };

export { msuRuntime };
