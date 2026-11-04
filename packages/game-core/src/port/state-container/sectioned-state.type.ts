/* @layer bridge-wasm @kind types */
interface CkStateSection {
  tag: string;
  version: number;
  bytes: Uint8Array;
}

type SectionIds = Readonly<Record<string, string>>;

interface CkStamp {
  pin: string;
  core: string;
  schema: string;
  mode: string;
  legacy: boolean;
  sections: SectionIds;
  past: Readonly<Record<string, SectionIds>>;
}

interface SectionedState {
  stamp: CkStamp;
  sections: CkStateSection[];
}

type Loadability =
  | { ok: true; stamp: CkStamp }
  | { ok: false; stamp: CkStamp | null; reason: 'not-a-state' | 'format-mismatch' | 'section-changed'; message: string };

export type { CkStamp, CkStateSection, Loadability, SectionIds, SectionedState };
