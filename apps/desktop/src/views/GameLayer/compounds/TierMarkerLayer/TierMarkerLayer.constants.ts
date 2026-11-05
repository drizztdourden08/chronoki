/* @layer renderer-components @kind constants */
import type { ChestTier } from '@chronoki/game-core';

const TIER_MARKER_GATE = 'treasureTierMarkers';
const LIVE_STATUSES: readonly string[] = ['running', 'paused'];
const LOCATION_WRAM = 0x0100;
const LOCATION_MASK = 0x1ff;
const TILE_PX = 16;
const MARKER_LIFT_PX = 4;
const MARKER_SIZE_PX = 10;
const BASE_VIEW_WIDTH = 256;
const BASE_VIEW_HEIGHT = 224;
const EXPORT_VIEW_WIDTH = 'CkViewWidth';
const EXPORT_VIEW_HEIGHT = 'CkViewHeight';
const BOB_PERIOD_MS = 900;
const BOB_PX = 1.5;

const STAR_COLORS: Readonly<Partial<Record<ChestTier, string>>> = { 1: '#ff3b3b', 2: '#4aa3ff' };
const GLOW_COLORS: Readonly<Partial<Record<ChestTier, string>>> = { 3: '#5ab8ff', 4: '#b25cff' };

export {
  BASE_VIEW_HEIGHT, BASE_VIEW_WIDTH, BOB_PERIOD_MS, BOB_PX, EXPORT_VIEW_HEIGHT, EXPORT_VIEW_WIDTH, GLOW_COLORS, LIVE_STATUSES,
  LOCATION_MASK, LOCATION_WRAM, MARKER_LIFT_PX, MARKER_SIZE_PX, STAR_COLORS, TIER_MARKER_GATE, TILE_PX,
};
