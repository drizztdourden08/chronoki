/* @layer bridge-wasm @kind constants */
import type { EditPlan } from './apply-seed.type';
import { planBossSwapEdits } from './boss-rando/plan-boss-swap-edits';
import { planDuplicateKindEdits } from './characters/plan-duplicate-kind-edits';
import { planRecruitSwapEdits } from './characters/plan-recruit-swap-edits';
import { planElementEdits } from './element-rando/plan-element-edits';
import { planEnemyOptionEdits } from './enemy-difficulty/plan-enemy-option-edits';
import { planGearRandoEdits } from './gear-rando/plan-gear-rando-edits';
import { planHealingRandoEdits } from './healing-rando/plan-healing-rando-edits';
import { planJetsItemEdits } from './jets/plan-jets-item-edits';
import { planChestEdits } from './plan-chest-edits';
import { planGiftEdits } from './plan-gift-edits';
import { planShopPriceEdits } from './shop-prices/plan-shop-price-edits';
import type { SeedPlanContext, SeedPlanStep } from './seed-plan-step.type';
import { planTabNameEdits } from './tabs/plan-tab-name-edits';
import { planTechDamageEdits } from './tech-damage/plan-tech-damage-edits';
import { planTechOrderEdits } from './tech-order/plan-tech-order-edits';

const editsOf = (ctx: SeedPlanContext, key: string): EditPlan['edits'] => ctx.done[key]?.edits ?? [];

const always = (): boolean => true;

const SEED_PLAN_STEPS: readonly SeedPlanStep[] = [
  { key: 'chest', when: always, plan: (pack, options, ctx) => planChestEdits(pack, ctx.chests, ctx.placement, options) },
  { key: 'gift', when: always, plan: (pack, _options, ctx) => planGiftEdits(pack, ctx.gifts, ctx.placement) },
  { key: 'enemy', when: always, plan: (pack, options) => ({ edits: planEnemyOptionEdits(pack, options), failed: [] }) },
  { key: 'jets', when: (options) => options.epochFail === true, plan: (pack) => planJetsItemEdits(pack) },
  { key: 'spot', when: always, plan: (_pack, _options, ctx) => ({ edits: [], failed: ctx.spotPlan.failed }) },
  {
    key: 'tab',
    when: (options) => Boolean(options.tabAmounts),
    plan: (pack, options) => (options.tabAmounts ? planTabNameEdits(pack, options.tabAmounts) : { edits: [], failed: [] }),
  },
  {
    key: 'tech',
    when: (options) => options.techOrder !== undefined,
    plan: (pack, options, ctx) => (options.techOrder === undefined ? { edits: [], failed: [] } : planTechOrderEdits(pack, options.techOrder, ctx.seed)),
  },
  {
    key: 'boss',
    when: (options) => Boolean(options.bossRando),
    plan: (pack, options) => (options.bossRando ? planBossSwapEdits(pack, options.bossRando) : { edits: [], failed: [] }),
  },
  {
    key: 'character',
    when: (options) => Boolean(options.characterRando),
    plan: (pack, options) => {
      if (!options.characterRando) return { edits: [], failed: [] };
      return options.duplicateCharacters === true
        ? planDuplicateKindEdits(pack, options.characterRando)
        : planRecruitSwapEdits(pack, options.characterRando);
    },
  },
  { key: 'gear', when: (options) => options.gearRando === true, plan: (pack, _options, ctx) => planGearRandoEdits(pack, ctx.seed) },
  { key: 'heal', when: (options) => options.healingRando === true, plan: (pack, _options, ctx) => planHealingRandoEdits(pack, ctx.seed) },
  {
    key: 'damage',
    when: (options) => options.techDamageRando === true,
    plan: (pack, _options, ctx) => planTechDamageEdits(pack, ctx.seed, editsOf(ctx, 'tech')),
  },
  {
    key: 'element',
    when: (options) => options.elementRando !== undefined,
    plan: (pack, options, ctx) =>
      options.elementRando === undefined
        ? { edits: [], failed: [] }
        : planElementEdits(pack, options.elementRando, [...editsOf(ctx, 'tech'), ...editsOf(ctx, 'damage')]),
  },
  {
    key: 'shop',
    when: (options) => options.shopPrices !== undefined,
    plan: (pack, options) => ({ edits: options.shopPrices === undefined ? [] : planShopPriceEdits(pack, options.shopPrices), failed: [] }),
  },
];

export { SEED_PLAN_STEPS };
