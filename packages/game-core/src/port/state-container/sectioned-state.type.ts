/* @layer bridge-wasm @kind types */
interface CkStateSection {
  tag: string;
  version: number;
  bytes: Uint8Array;
}

interface CkStamp {
  pin: string;
  core: string;
  schema: string;
  mode: string;
  legacy: boolean;
}

interface SectionedState {
  stamp: CkStamp;
  sections: CkStateSection[];
}

type Loadability =
  | { ok: true; stamp: CkStamp }
  | { ok: false; stamp: CkStamp | null; reason: 'not-a-state' | 'format-mismatch'; message: string };

export type { CkStamp, CkStateSection, Loadability, SectionedState };
