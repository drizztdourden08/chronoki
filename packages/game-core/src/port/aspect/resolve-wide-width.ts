/* @layer bridge-wasm @kind logic */
import { aspectAfterTall } from '@chronoki/features';
import type { GateOptions } from '@chronoki/features';
import { CT_ASPECT_MIN_WIDTH, CT_FALLBACK_RATIO } from './aspect.constants';
import { parseRatio } from './parse-ratio';
import { ratioToWidth } from './ratio-to-width';

const detectedRatio = (options: GateOptions): number => options.screenRatio ?? CT_FALLBACK_RATIO;

const ratioOf = (options: GateOptions, tallOn: boolean): number => {
  const choice = aspectAfterTall(options.aspectRatio, tallOn);
  if (choice === 'original') return 0;
  if (choice === 'auto' || choice === 'screen') return detectedRatio(options);
  if (choice === 'custom') {
    return options.customAspectW > 0 && options.customAspectH > 0 ? options.customAspectW / options.customAspectH : detectedRatio(options);
  }
  return parseRatio(choice);
};

const resolveWideWidth = (effective: ReadonlySet<string>, options: GateOptions): number => {
  if (!effective.has('widescreen')) return CT_ASPECT_MIN_WIDTH;
  const ratio = ratioOf(options, effective.has('tallRendering'));
  return ratio > 0 ? ratioToWidth(ratio) : CT_ASPECT_MIN_WIDTH;
};

export { resolveWideWidth };
