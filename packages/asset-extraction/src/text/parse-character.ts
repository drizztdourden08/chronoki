/* @layer shared-asset-extraction @kind logic */
const PUNCT: Record<number, string> = {
  0xde: '!', 0xdf: '?', 0xe0: '/', 0xe1: '"', 0xe2: '"', 0xe3: ':', 0xe4: '&',
  0xe5: '(', 0xe6: ')', 0xe7: "'", 0xe8: '.', 0xe9: ',', 0xea: '=', 0xeb: '-',
  0xec: '+', 0xed: '%', 0xee: '♫', 0xef: ' ', 0xf0: '♥', 0xf1: '…',
  0xf2: '∞', 0xf3: '#',
};

/** text.py parse_character: one font byte -> its character (A-Z, a-z, 0-9, the punctuation block, U+FFFD otherwise). */
const parseCharacter = (v: number): string => {
  if (v >= 0xa0 && v <= 0xb9) return String.fromCharCode(0x41 + (v - 0xa0));
  if (v >= 0xba && v <= 0xd3) return String.fromCharCode(0x61 + (v - 0xba));
  if (v >= 0xd4 && v <= 0xdd) return String.fromCharCode(0x30 + (v - 0xd4));
  return PUNCT[v] ?? '�';
};

export { parseCharacter };
