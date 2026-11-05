/* @layer bridge-wasm @kind constants */
import { planDeathPeakMusic } from './alt-music/plan-death-peak-music';
import { planZenanMusic } from './alt-music/plan-zenan-music';
import { planFastTabs } from './fast-tabs/plan-fast-tabs';
import type { QolPackId, QolPlanner } from './qol.type';
import { planSightscopeBosses } from './sightscope-bosses/plan-sightscope-bosses';

const QOL_PACK_PLANNERS: Readonly<Record<QolPackId, QolPlanner>> = {
  fastTabs: planFastTabs,
  zenanAltMusic: planZenanMusic,
  deathPeakAltMusic: planDeathPeakMusic,
  sightscopeBosses: planSightscopeBosses,
};

const QOL_PACK_IDS: readonly QolPackId[] = ['fastTabs', 'zenanAltMusic', 'deathPeakAltMusic', 'sightscopeBosses'];

export { QOL_PACK_IDS, QOL_PACK_PLANNERS };
