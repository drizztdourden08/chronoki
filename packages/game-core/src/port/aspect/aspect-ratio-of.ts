/* @layer bridge-wasm @kind logic */
import { aspectAfterTall } from '@chronoki/features';
import type { GateOptions } from '@chronoki/features';
import { CT_FALLBACK_RATIO } from './aspect.constants';
import { parseRatio } from './parse-ratio';

const detectedRatio = (options: GateOptions): number => options.screenRatio ?? CT_FALLBACK_RATIO;

const choiceRatio = (options: GateOptions, tallOn: boolean): number => {
  const choice = aspectAfterTall(options.aspectRatio, tallOn);
  if (choice === 'original') return 0;
  if (choice === 'auto' || choice === 'screen') return detectedRatio(options);
  if (choice === 'custom') {
    return options.customAspectW > 0 && options.customAspectH > 0 ? options.customAspectW / options.customAspectH : detectedRatio(options);
  }
  return parseRatio(choice);
};

const aspectRatioOf = (effective: ReadonlySet<string>, options: GateOptions): number =>
  effective.has('widescreen') ? choiceRatio(options, effective.has('tallRendering')) : 0;

export { aspectRatioOf };
