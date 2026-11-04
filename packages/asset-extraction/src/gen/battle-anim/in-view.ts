/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from '../shared/oam-decode';

const inView = (s: Sprite): boolean => s.y < 210 && s.x > -60 && s.x < 256;

export { inView };
