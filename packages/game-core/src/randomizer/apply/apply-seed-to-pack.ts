/* @layer bridge-wasm @kind logic */
import { deriveChestChecks } from '../checks/derive-chest-checks';
import { deriveGiftChecks } from '../checks/derive-gift-checks';
import type { ApplyOptions, ApplyResult, PackEdit, Placement } from './apply-seed.type';
import { planChestEdits } from './plan-chest-edits';
import { planEnemyOptionEdits } from './enemy-difficulty/plan-enemy-option-edits';
import { planBossSwapEdits } from './boss-rando/plan-boss-swap-edits';
import { planJetsItemEdits } from './jets/plan-jets-item-edits';
import { planShopPriceEdits } from './shop-prices/plan-shop-price-edits';
import { planGiftEdits } from './plan-gift-edits';
import { planSpotGiftSplices } from './plan-spot-gift-splices';
import { planTabNameEdits } from './tabs/plan-tab-name-edits';
import type { ScriptSplice } from './script/script-splice.type';
import { spliceSceneScripts } from './script/splice-scene-scripts';
import { planGearRandoEdits } from './gear-rando/plan-gear-rando-edits';
import { planHealingRandoEdits } from './healing-rando/plan-healing-rando-edits';
import { planElementEdits } from './element-rando/plan-element-edits';
import { planTechDamageEdits } from './tech-damage/plan-tech-damage-edits';
import { planTechOrderEdits } from './tech-order/plan-tech-order-edits';

const stale = (pack: Uint8Array, edits: PackEdit[]): string[] =>
  edits.filter((e) => pack[e.at] !== e.old).map((e) => e.why);

const applySeedToPack = (
  pack: Uint8Array,
  placement: Placement,
  splices: readonly ScriptSplice[] = [],
  options: ApplyOptions = {},
): ApplyResult => {
  const chests = deriveChestChecks(pack);
  const gifts = deriveGiftChecks(pack);
  const known = new Set<string>([...chests, ...gifts].map((c) => c.id).concat(options.spotGifts ?? []));
  const unknown = Object.keys(placement).filter((id) => !known.has(id));
  const chestPlan = planChestEdits(pack, chests, placement, options);
  const giftPlan = planGiftEdits(pack, gifts, placement);
  const jetsPlan = options.epochFail === true ? planJetsItemEdits(pack) : { edits: [], failed: [] };
  const spotPlan = planSpotGiftSplices(placement, options.spotGifts);
  const tabPlan = options.tabAmounts ? planTabNameEdits(pack, options.tabAmounts) : { edits: [], failed: [] };
  const techPlan = options.techOrder === undefined ? { edits: [], failed: [] } : planTechOrderEdits(pack, options.techOrder, options.seed ?? '');
  const none = { edits: [], failed: [] };
  const seed = options.seed ?? '';
  const bossPlan = options.bossRando ? planBossSwapEdits(pack, options.bossRando) : none;
  const gearPlan = options.gearRando === true ? planGearRandoEdits(pack, seed) : none;
  const healPlan = options.healingRando === true ? planHealingRandoEdits(pack, seed) : none;
  const damagePlan = options.techDamageRando === true ? planTechDamageEdits(pack, seed, techPlan.edits) : none;
  const elementPlan = options.elementRando === undefined ? none : planElementEdits(pack, options.elementRando, [...techPlan.edits, ...damagePlan.edits]);
  const edits = [...chestPlan.edits, ...giftPlan.edits, ...planEnemyOptionEdits(pack, options), ...jetsPlan.edits, ...tabPlan.edits,
    ...techPlan.edits, ...bossPlan.edits, ...gearPlan.edits, ...healPlan.edits, ...damagePlan.edits, ...elementPlan.edits,
    ...(options.shopPrices === undefined ? [] : planShopPriceEdits(pack, options.shopPrices))];
  const failed = [...new Set([
    ...unknown, ...chestPlan.failed, ...giftPlan.failed, ...jetsPlan.failed, ...spotPlan.failed, ...tabPlan.failed,
    ...techPlan.failed, ...bossPlan.failed, ...gearPlan.failed, ...healPlan.failed, ...damagePlan.failed, ...elementPlan.failed, ...stale(pack, edits),
  ])];
  if (failed.length > 0) return { ok: false, failed };
  const edited = pack.slice();
  edits.forEach((e) => {
    edited[e.at] = e.next;
  });
  const spliced = spliceSceneScripts(edited, [...splices, ...spotPlan.splices]);
  if (!spliced.ok) return { ok: false, failed: [...new Set(spliced.failed)] };
  return { ok: true, bytes: spliced.bytes, edits: edits.length };
};

export { applySeedToPack };
