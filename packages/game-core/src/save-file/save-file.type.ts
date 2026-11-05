/* @layer bridge-wasm @kind types */
interface SramSlotSummary {
  slot: number;
  leadId: number;
  leadName: string | null;
  level: number;
  saveNumber: number;
  locationId: number;
  hours: number;
  minutes: number;
}

interface SlotChecks {
  done: string[];
  unknown: string[];
}

export type { SlotChecks, SramSlotSummary };
