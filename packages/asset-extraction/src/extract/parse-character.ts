/* @layer shared-asset-extraction @kind logic */
import { PUNCT } from './text-codes.constants';

const parseCharacter = (v: number): string => {
  if (v >= 0xa0 && v <= 0xb9) return String.fromCharCode(0x41 + (v - 0xa0));
  if (v >= 0xba && v <= 0xd3) return String.fromCharCode(0x61 + (v - 0xba));
  if (v >= 0xd4 && v <= 0xdd) return String.fromCharCode(0x30 + (v - 0xd4));
  return PUNCT[v] ?? '�';
};

export { parseCharacter };
