/* @layer bridge-wasm @kind type */
import type { CtSlotData } from './ct-slot-data.type';

type CtSlotReading = { kind: 'ok'; data: CtSlotData } | { kind: 'malformed' } | { kind: 'version'; message: string };

export type { CtSlotReading };
