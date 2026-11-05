/* @layer bridge-wasm @kind type */
import type { SpliceScope } from '../script/script-splice.type';

type StoryWindowGift = {
  check: string;
  scene: number;
  scope: SpliceScope;
  anchor: readonly number[];
  before: readonly number[];
  after: readonly number[];
  why: string;
};

export type { StoryWindowGift };
