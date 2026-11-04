/* @layer shared-asset-extraction @kind constants */
import type { Anchor } from './battle-gato-atkfaces.type';

const CRONO_AT: Record<string, [number, number]> = { L: [96, 111], R: [180, 111], U: [136, 55] };
const GATO_BODY = [0x68, 0x6a, 0x6c, 0x6e, 0x80, 0x82, 0x84, 0x86, 0x88, 0x8a, 0x8c, 0x8e];
const CAPS: [string, number, number, string, Anchor, string | null, Anchor | null][] = [
  ['GA0_up', 0, 49, 'U_f185', [110, 27], null, null],
  ['GA2_left', 2, 20, 'L_f108', [102, 37], 'L_f122', [86, 37]],
  ['GA3_right', 3, 21, 'R_f153', [128, 37], 'R_f166', [128, 37]],
];

export { CRONO_AT, GATO_BODY, CAPS };
