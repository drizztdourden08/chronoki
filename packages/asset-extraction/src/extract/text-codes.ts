/* @layer shared-asset-extraction @kind logic */
/** text.parse_character: a font token (>= 0xA0) as a character. */
const PUNCT: Record<number, string> = {
  0xde: '!', 0xdf: '?', 0xe0: '/', 0xe1: '"', 0xe2: '"', 0xe3: ':', 0xe4: '&', 0xe5: '(', 0xe6: ')', 0xe7: "'",
  0xe8: '.', 0xe9: ',', 0xea: '=', 0xeb: '-', 0xec: '+', 0xed: '%', 0xee: '♫', 0xef: ' ', 0xf0: '♥',
  0xf1: '…', 0xf2: '∞', 0xf3: '#',
};

const parseCharacter = (v: number): string => {
  if (v >= 0xa0 && v <= 0xb9) return String.fromCharCode(0x41 + (v - 0xa0));
  if (v >= 0xba && v <= 0xd3) return String.fromCharCode(0x61 + (v - 0xba));
  if (v >= 0xd4 && v <= 0xdd) return String.fromCharCode(0x30 + (v - 0xd4));
  return PUNCT[v] ?? '�';
};

const NAME_DEFAULT: Record<number, string> = {
  0x13: 'Crono', 0x14: 'Marle', 0x15: 'Lucca', 0x16: 'Robo', 0x17: 'Frog', 0x18: 'Ayla', 0x19: 'Magus',
  0x1a: 'Crono', 0x1b: '{pt1}', 0x1c: '{pt2}', 0x1d: '{pt3}', 0x20: 'Epoch',
};

/** Control-code renderings; '%s' is the indent (three spaces, or the packer's marker). */
const CONTROL_TEXT: Record<number, string> = {
  0x05: '\n', 0x06: '\n%s', 0x07: '\n', 0x08: '\n%s', 0x09: '\n', 0x0a: '\n%s',
  0x0b: '\n———\n', 0x0c: '\n———\n%s',
  0x0d: '{num}', 0x0e: '{num}', 0x0f: '{num}', 0x1e: 'Nadia', 0x1f: '{item}',
};

/** text.special: a control token's text and the extra bytes it consumes. */
const special = (v: number, namesub: boolean, ind: string): [string, number] => {
  if (v === 0x12) return ['', 1];
  if (v in NAME_DEFAULT) return [namesub ? `\x01${String.fromCharCode(v)}` : NAME_DEFAULT[v]!, 0];
  if (namesub && (v === 0x0d || v === 0x0e || v === 0x0f || v === 0x1f)) return [`\x01${String.fromCharCode(v)}`, 0];
  const t = CONTROL_TEXT[v] ?? '';
  return [t.includes('%s') ? t.replace('%s', ind) : t, 0];
};

export { parseCharacter, special };
