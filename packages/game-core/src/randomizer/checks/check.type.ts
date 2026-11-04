/* @layer bridge-wasm @kind type */
type FlagProbe = { region: 'wram'; offset: number; mask: number; compare: 'set' | 'clear' };

type CheckKind = 'chest' | 'gift' | 'event';

type CheckDef = {
  id: string;
  kind: CheckKind;
  locationId: number;
  tile?: { x: number; y: number };
  probe?: FlagProbe;
  vanillaItem: number;
  scriptId?: number;
  patchAt?: number[];
};

export type { CheckDef, CheckKind, FlagProbe };
