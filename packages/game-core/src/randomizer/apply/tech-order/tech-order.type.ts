/* @layer bridge-wasm @kind type */
import type { PackEdit } from '../apply-seed.type';

type TechOrderMode = 'balanced-random' | 'full-random';

type RecordTable = { rom: number; size: number };

type SlotPermutations = readonly (readonly number[])[];

type RomSpace = {
  read(addr: number): number | undefined;
  locate(addr: number): number[];
};

type RomStage = {
  put(addr: number, value: number, why: string): void;
  edits(): PackEdit[];
};

type NamedTable = { at: number; size: number };

type TechOrderPlan = { edits: PackEdit[]; failed: string[] };

export type { NamedTable, RecordTable, RomSpace, RomStage, SlotPermutations, TechOrderMode, TechOrderPlan };
