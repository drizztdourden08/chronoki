/* @layer shared-asset-extraction @kind logic */
import { romRegion } from '../rom/rom-region';
import { hexByte } from './c-hex-byte';
import { RETURN_HEAD, RETURN_BARRIER, RETURN_TAIL, COMMENT } from './ct-regroup.constants';

const startsWith = (data: Uint8Array, at: number, want: number[]): boolean => want.every((b, i) => data[at + i] === b);

const emit = (name: string, data: Uint8Array): string =>
  `static const uint8_t ${name}[${data.length}] = {\n  ${Array.from(data, hexByte).join(', ')}\n};\n`;

const genCtRegroup = (rom: Uint8Array): string => {
  const ret = romRegion(rom, 0x5d37, 0x5d37 + 0x20);
  const d9 = romRegion(rom, 0x5d50, 0x5d50 + 0x20);
  const tail = romRegion(rom, 0x5d68, 0x5d68 + 6);
  if (!startsWith(ret, 0, RETURN_HEAD)) throw new Error('RETURN block head mismatch -- ROM changed?');
  if (!startsWith(ret, 15, RETURN_BARRIER)) throw new Error('RETURN block barrier-IF mismatch');
  if (!startsWith(ret, 20, RETURN_TAIL)) throw new Error('RETURN block tail mismatch');
  return [
    ...COMMENT.map((l) => `${l}\n`),
    '#ifndef CT_REGROUP_H\n#define CT_REGROUP_H\n#include <stdint.h>\n',
    emit('ctRegroupReturn', ret),
    emit('ctRegroupD9', d9),
    emit('ctRegroupTail', tail),
    '#endif\n',
  ].join('');
};

export { genCtRegroup };
