/* @layer shared-asset-extraction @kind logic */
/** The name-substitution control codes: the packer emits a render-time marker for them (text.py _NAME_CODES). */
const NAME_CODES: ReadonlySet<number> = new Set([0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x20]);

const NAME_DEFAULT: Record<number, string> = {
  0x13: 'Crono', 0x14: 'Marle', 0x15: 'Lucca', 0x16: 'Robo', 0x17: 'Frog', 0x18: 'Ayla',
  0x19: 'Magus', 0x1a: 'Crono', 0x1b: '{pt1}', 0x1c: '{pt2}', 0x1d: '{pt3}', 0x20: 'Epoch',
};

/** A '%s' is where the break token's indent goes (text.py _NAMES). */
const NAMES: Record<number, string> = {
  0x05: '\n', 0x06: '\n%s', 0x07: '\n', 0x08: '\n%s', 0x09: '\n', 0x0a: '\n%s',
  0x0b: '\n———\n', 0x0c: '\n———\n%s',
  0x0d: '{num}', 0x0e: '{num}', 0x0f: '{num}', 0x1e: 'Nadia', 0x1f: '{item}',
};

/** text.py special(): a control code 0x04-0x20 -> [its text, the extra bytes it consumed]. */
const special = (v: number, namesub: boolean, ind: string): [string, number] => {
  if (v === 0x12) return ['', 1];
  if (NAME_CODES.has(v)) return [namesub ? `\x01${String.fromCharCode(v)}` : (NAME_DEFAULT[v] as string), 0];
  if (namesub && (v === 0x0d || v === 0x0e || v === 0x0f || v === 0x1f)) return [`\x01${String.fromCharCode(v)}`, 0];
  const t = NAMES[v] ?? '';
  return [t.includes('%s') ? t.replace('%s', () => ind) : t, 0];
};

export { special };
