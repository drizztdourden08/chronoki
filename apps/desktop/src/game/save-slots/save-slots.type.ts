/* @layer bridge-wasm @kind types */
interface SlotInfo {
  slot: number;
  savedAt: number | null;
  screenshot: string | null;
}

export type { SlotInfo };
