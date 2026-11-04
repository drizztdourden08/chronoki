/* @layer shared-game-data @kind types */
type MsuTrackResolution = {
  readonly kind: 'silence' | 'ignored' | 'track';
  readonly trackNum: number;
  readonly fallback?: number;
};

export type { MsuTrackResolution };
