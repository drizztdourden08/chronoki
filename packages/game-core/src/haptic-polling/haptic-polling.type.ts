/* @layer bridge-wasm @kind types */
interface RawHapticEvent {
  kind: number;
  param: number;
}

type HapticEventHandler = (kind: number, param: number) => void;

export type { HapticEventHandler, RawHapticEvent };
