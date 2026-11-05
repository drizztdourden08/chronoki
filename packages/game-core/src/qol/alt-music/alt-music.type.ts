/* @layer bridge-wasm @kind types */
import type { PackEdit } from '../../randomizer/apply/apply-seed.type';

type Blob = { type: number; id: number; data: number[] };

type MusicPackOptions = { firstRecordSong?: number; zenanOps?: number[]; peakOps?: number[] };

type SongPlan = { edit: PackEdit | null; failed: string | null };

type SceneSongSpot = { scene: number; object: number; fn: number; from: number | null; song: number };

export type { Blob, MusicPackOptions, SceneSongSpot, SongPlan };
