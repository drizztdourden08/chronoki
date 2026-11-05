/* @layer bridge-wasm @kind type */
import type { CheckDef } from '../checks/check.type';
import type { ApplyOptions, EditPlan, Placement } from './apply-seed.type';
import type { SpotGiftPlan } from './spot-gift-plan.type';

type SeedPlanContext = {
  chests: CheckDef[];
  gifts: CheckDef[];
  placement: Placement;
  spotPlan: SpotGiftPlan;
  seed: string;
  done: Readonly<Record<string, EditPlan>>;
};

type SeedPlanStep = {
  key: string;
  when: (options: ApplyOptions) => boolean;
  plan: (pack: Uint8Array, options: ApplyOptions, ctx: SeedPlanContext) => EditPlan;
};

export type { SeedPlanContext, SeedPlanStep };
