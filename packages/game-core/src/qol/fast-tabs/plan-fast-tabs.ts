/* @layer bridge-wasm @kind logic */
import type { QolPlanner } from '../qol.type';
import { FAST_TAB_SPOTS } from './fast-tab-spots.constants';
import { planTabSplices } from './plan-tab-splices';
import { planTomasGrave } from './plan-tomas-grave';

const planFastTabs: QolPlanner = (pack) => {
  const plans = [...FAST_TAB_SPOTS.map((spot) => planTabSplices(pack, spot)), planTomasGrave(pack)];
  return { edits: [], failed: [], splices: plans.flatMap((p) => p.splices), notes: plans.flatMap((p) => p.notes) };
};

export { planFastTabs };
