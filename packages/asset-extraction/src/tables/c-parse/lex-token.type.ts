/* @layer shared-asset-extraction @kind types */
import type { PackToken } from '../pack.type';

interface LexToken extends PackToken {
  start: number;
  end: number;
}

export type { LexToken };
