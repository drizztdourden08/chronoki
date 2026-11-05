/* @layer bridge-wasm @kind type */
import type { ItemDifficulty } from '../world/treasure-tiers/treasure-tier.type';
import type { TechOrderMode } from './tech-order/tech-order.type';

type Placement = Readonly<Record<string, number>>;

type ApplyOptions = { difficulty?: ItemDifficulty; hardEnemies?: boolean; epochFail?: boolean; bossDepths?: ReadonlyMap<string, number>;
  techOrder?: TechOrderMode; seed?: string };

type PackEdit = { at: number; old: number; next: number; why: string };

type EditPlan = { edits: PackEdit[]; failed: string[] };

type ApplyResult = { ok: true; bytes: Uint8Array; edits: number } | { ok: false; failed: string[] };

type SeedApplier = (pack: Uint8Array, placement: Placement) => ApplyResult;

export type { ApplyOptions, ApplyResult, EditPlan, PackEdit, Placement, SeedApplier };
