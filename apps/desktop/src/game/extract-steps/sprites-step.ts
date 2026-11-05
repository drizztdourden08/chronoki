/* @layer bridge-wasm @kind logic */
import { partySpriteBuffers } from '@chronoki/asset-extraction';
import { defineStep } from './define-step';

const spritesStep = defineStep<'sprites'>(async ({ pack }, _data, report) => {
  report.progress(0, 'Extracting the party sprites');
  const buffers = await partySpriteBuffers(pack);
  report.progress(1, 'Party sprites extracted');
  return buffers;
});

export { spritesStep };
