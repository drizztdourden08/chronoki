/* @layer bridge-wasm @kind type */
import type { PackEdit } from '../randomizer/apply/apply-seed.type';

type QolPackId = 'fastTabs' | 'zenanAltMusic' | 'deathPeakAltMusic' | 'sightscopeBosses';

type QolPlan = { edits: PackEdit[]; failed: string[] };

type QolPlanner = (pack: Uint8Array) => QolPlan;

type QolSkip = { id: QolPackId; why: string[] };

type QolResult = { bytes: Uint8Array; applied: QolPackId[]; skipped: QolSkip[] };

export type { QolPackId, QolPlan, QolPlanner, QolResult, QolSkip };
