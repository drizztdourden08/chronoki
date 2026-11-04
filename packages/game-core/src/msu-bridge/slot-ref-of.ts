/* @layer bridge-wasm @kind logic */
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';

const slotRefOf = (kind: string, id: string | number): SaveSlotRef => {
  if (kind === 'quick') return { kind: 'quick', slot: Number(id) };
  return { kind: kind === 'auto' ? 'auto' : 'normal', id: String(id) };
};

export { slotRefOf };
