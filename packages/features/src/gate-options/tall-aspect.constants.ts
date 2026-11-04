/* @layer shared @kind constants */
import type { AspectRatioChoice } from './gate-options.type';

const TALL_ASPECT_CHOICES: readonly AspectRatioChoice[] = ['4:5', '3:4'];

const TALL_FALLBACK_ASPECT: AspectRatioChoice = '4:3';

export { TALL_ASPECT_CHOICES, TALL_FALLBACK_ASPECT };
