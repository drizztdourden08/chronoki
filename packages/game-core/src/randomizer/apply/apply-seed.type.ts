/* @layer bridge-wasm @kind type */
import type { CtSpotId } from '../world/ct-world-keys.type';
import type { TabAmounts } from '../world/tabs/tab-amounts.type';
import type { CharacterAssignment } from '../world/recruits/character-assignment.type';
import type { BossAssignment } from './boss-rando/boss-rando.type';
import type { ShopPriceOption } from './shop-prices/shop-prices.type';
import type { ItemDifficulty } from '../world/treasure-tiers/treasure-tier.type';
import type { ElementAssignment } from './element-rando/element-rando.type';
import type { TechOrderMode } from './tech-order/tech-order.type';

type Placement = Readonly<Record<string, number>>;

type ApplyOptions = {
  difficulty?: ItemDifficulty;
  hardEnemies?: boolean;
  epochFail?: boolean;
  bossDepths?: ReadonlyMap<string, number>;
  shopPrices?: ShopPriceOption;
  spotGifts?: readonly CtSpotId[];
  tabAmounts?: TabAmounts;
  techOrder?: TechOrderMode;
  gearRando?: boolean;
  healingRando?: boolean;
  techDamageRando?: boolean;
  elementRando?: ElementAssignment;
  seed?: string;
  bossRando?: BossAssignment;
  characterRando?: CharacterAssignment;
  duplicateCharacters?: boolean;
};

type PackEdit = { at: number; old: number; next: number; why: string };

type EditPlan = { edits: PackEdit[]; failed: string[] };

type ApplyResult = { ok: true; bytes: Uint8Array; edits: number } | { ok: false; failed: string[] };

type SeedApplier = (pack: Uint8Array, placement: Placement) => ApplyResult;

export type { ApplyOptions, ApplyResult, EditPlan, PackEdit, Placement, SeedApplier };
