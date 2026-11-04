/* @layer shared @kind logic */
import type { AspectRatioChoice } from './gate-options.type';
import { TALL_ASPECT_CHOICES, TALL_FALLBACK_ASPECT } from './tall-aspect.constants';

const aspectAfterTall = (aspectRatio: AspectRatioChoice, tallOn: boolean): AspectRatioChoice =>
  !tallOn && TALL_ASPECT_CHOICES.includes(aspectRatio) ? TALL_FALLBACK_ASPECT : aspectRatio;

export { aspectAfterTall };
