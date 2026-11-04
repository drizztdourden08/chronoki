/* @layer bridge-wasm @kind types */
import type { CkSettings } from '../core-config-ini.type';

interface CkFrameSize {
  width: number;
  height: number;
}

type CkFrameInput = Pick<CkSettings, 'widescreen' | 'wideWidth' | 'renderScale' | 'interpolation'> &
  Partial<Pick<CkSettings, 'tallLines'>>;

export type { CkFrameInput, CkFrameSize };
