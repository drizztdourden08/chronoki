/* @layer shared-asset-extraction @kind logic */
import { TONE_DOC } from './menu-loader-art.constants';
import { rgb2 } from './menu-loader-rgb2';

const toneBlock = (cg: Uint8Array): string =>
  `${TONE_DOC}${[0, 1, 2, 3].map((i) => `  {${rgb2(cg, 4, i).join(',')}},\n`).join('')}};\n\n`;

export { toneBlock };
