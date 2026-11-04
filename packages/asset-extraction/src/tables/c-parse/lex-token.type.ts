/* @layer shared-asset-extraction @kind types */
import type { PackToken } from '../pack.type';

/** A token of a header's code with its span (the `end` of the last token and the `start` of the next are used for slices). */
interface LexToken extends PackToken {
  start: number;
  end: number;
}

export type { LexToken };
