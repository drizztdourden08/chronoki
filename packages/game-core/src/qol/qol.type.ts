/* @layer bridge-wasm @kind type */
import type { PackEdit } from '../randomizer/apply/apply-seed.type';
import type { ScriptSplice } from '../randomizer/apply/script/script-splice.type';

type QolPackId = 'fastTabs' | 'zenanAltMusic' | 'deathPeakAltMusic' | 'sightscopeBosses';

type QolPlan = { edits: PackEdit[]; failed: string[]; splices?: ScriptSplice[]; notes?: string[] };

type QolPlanner = (pack: Uint8Array) => QolPlan;

type QolSkip = { id: QolPackId; why: string[] };

type QolResult = { bytes: Uint8Array; applied: QolPackId[]; skipped: QolSkip[]; notes?: string[] };

export type { QolPackId, QolPlan, QolPlanner, QolResult, QolSkip };
