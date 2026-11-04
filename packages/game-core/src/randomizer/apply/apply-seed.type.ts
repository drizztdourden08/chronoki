/* @layer bridge-wasm @kind type */
type Placement = Readonly<Record<string, number>>;

type PackEdit = { at: number; old: number; next: number; why: string };

type EditPlan = { edits: PackEdit[]; failed: string[] };

type ApplyResult = { ok: true; bytes: Uint8Array; edits: number } | { ok: false; failed: string[] };

type SeedApplier = (pack: Uint8Array, placement: Placement) => ApplyResult;

export type { ApplyResult, EditPlan, PackEdit, Placement, SeedApplier };
