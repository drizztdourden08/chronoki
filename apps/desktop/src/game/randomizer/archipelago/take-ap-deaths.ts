/* @layer bridge-wasm @kind logic */
import { apCallsOrNull } from './chronoki-ap-calls';
import {
  AP_DEATH_CAUSE_HOST_KILL, AP_EVENT_BYTES, AP_EVENT_DEATH, AP_EVENT_MAX, AP_EVENTS_HEADER_BYTES, CK_AP_TAKE_EVENTS,
} from './chronoki-ap-death-link.constants';

const takeApDeaths = (): number => {
  const calls = apCallsOrNull();
  if (calls === null || !calls.has(CK_AP_TAKE_EVENTS)) return 0;
  try {
    const ptr = calls.number(CK_AP_TAKE_EVENTS);
    if (ptr === 0) return 0;
    const heap = calls.heap();
    const view = new DataView(heap.buffer, heap.byteOffset + ptr, AP_EVENTS_HEADER_BYTES + AP_EVENT_MAX * AP_EVENT_BYTES);
    const count = Math.min(view.getUint32(8, true), AP_EVENT_MAX);
    let deaths = 0;
    for (let i = 0; i < count; i += 1) {
      const at = AP_EVENTS_HEADER_BYTES + i * AP_EVENT_BYTES;
      if (view.getInt32(at, true) === AP_EVENT_DEATH && view.getInt32(at + 8, true) !== AP_DEATH_CAUSE_HOST_KILL) deaths += 1;
    }
    return deaths;
  } catch {
    return 0;
  }
};

export { takeApDeaths };
