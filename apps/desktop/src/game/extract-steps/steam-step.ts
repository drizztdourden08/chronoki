/* @layer bridge-wasm @kind logic */
import { buildCtWide } from '@chronoki/asset-extraction';
import { defineStep } from './define-step';
import { fileArchive } from './file-archive';

const steamStep = defineStep<'steam'>(async ({ file }, _data, report) => {
  report.progress(0, 'Reading the Steam archive');
  const wide = await buildCtWide(fileArchive(file));
  report.progress(1, 'Steam margins built');
  return wide;
});

export { steamStep };
