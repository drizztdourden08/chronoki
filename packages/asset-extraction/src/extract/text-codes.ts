/* @layer shared-asset-extraction @kind logic */

import { PUNCT, NAME_DEFAULT, CONTROL_TEXT } from './text-codes.constants';


const parseCharacter = (v: number): string => {
  if (v >= 0xa0 && v <= 0xb9) return String.fromCharCode(0x41 + (v - 0xa0));
  if (v >= 0xba && v <= 0xd3) return String.fromCharCode(0x61 + (v - 0xba));
  if (v >= 0xd4 && v <= 0xdd) return String.fromCharCode(0x30 + (v - 0xd4));
  return PUNCT[v] ?? '�';
};

const special = (v: number, namesub: boolean, ind: string): [string, number] => {
  if (v === 0x12) return ['', 1];
  if (v in NAME_DEFAULT) return [namesub ? `\x01${String.fromCharCode(v)}` : NAME_DEFAULT[v]!, 0];
  if (namesub && (v === 0x0d || v === 0x0e || v === 0x0f || v === 0x1f)) return [`\x01${String.fromCharCode(v)}`, 0];
  const t = CONTROL_TEXT[v] ?? '';
  return [t.includes('%s') ? t.replace('%s', ind) : t, 0];
};

export { parseCharacter, special };
