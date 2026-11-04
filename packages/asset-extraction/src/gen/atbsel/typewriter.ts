/* @layer shared-asset-extraction @kind logic */
import { TEXT_X } from './typewriter.constants';
import type { EmitTypewriterOptions } from './typewriter.type';

const pyStr = (v: number | undefined): string => (v === undefined ? 'None' : String(v));

const emitTypewriter = ({ pens, empty, ex, ey, ew, eh }: EmitTypewriterOptions): string => {
  const o: string[] = [];
  const w = (t = ''): void => {
    o.push(`${t}\n`);
  };
  w();
  w('// ---- TYPEWRITER (derivation in tools/gen/atbsel.py) ------------------------------------');
  w('// Per-DRAWN-FRAME pen positions, straight from the ROM: the $FF:CF3B string at index row+1,');
  w("// each char's width from $C2:60E6 indexed by (code - 0xA0), starting at the $0DD2 = 8 indent.");
  w('// Screen x of the write head = CT_ATBSEL_TEXT_X + pen. Two chars are drawn per frame ($0DC9');
  w('// = 2, immediate at C2/E5FB, spent by DEC $13 in C2/58B2); the newline (0x05) and the');
  w('// terminator (0x00) each cost a frame that draws NOTHING (they return early without');
  w('// decrementing the budget), so a line ends with one blank frame before the next begins.');
  w(`#define CT_ATBSEL_TEXT_X ${TEXT_X}`);
  w('#define CT_ATBSEL_NLINES 2');
  const mx = Math.max(...pens.flatMap((r) => r.map((p) => p.length)));
  w(`#define CT_ATBSEL_MAXSTEP ${mx}`);
  const n = (r: number, l: number): number => ((pens[r] as number[][])[l] as number[]).length;
  w(`static const uint8_t ctAtbSelPenN[2][CT_ATBSEL_NLINES] = { {${n(0, 0)},${n(0, 1)}}, {${n(1, 0)},${n(1, 1)}} };`);
  w('static const uint8_t ctAtbSelPen[2][CT_ATBSEL_NLINES][CT_ATBSEL_MAXSTEP] = {');
  for (const r of [0, 1]) {
    const parts = [0, 1].map((li) => {
      const p = (pens[r] as number[][])[li] as number[];
      return `{${[...p, ...new Array<number>(mx - p.length).fill(0)].join(',')}}`;
    });
    w(`  { ${parts.join(', ')} },`);
  }
  w('};');
  w();
  w('// The EMPTY text box -- what the two lines look like with no glyphs on them. Captured at the');
  w("// reveal's FIRST frame, which is the only place these pixels exist: that frame erases the old");
  w('// text and draws just two glyphs, so line 1 is untouched and line 0 is empty right of its pen.');
  w('// Both settled frames carry full text and cannot supply this.');
  w("// Line 0 at x = 53 (y149-154) is the ACTIVE reveal's first frame instead: the WAIT capture's first glyph pair");
  w("// reaches x = 54 (pen 22), ACTIVE's cut is x = 53 (pen 21) -- MEASURED from power-on (tools/naming_cmp.py boot, f301).");
  w(`#define CT_ATBSEL_EMPTY_X ${ex}`);
  w(`#define CT_ATBSEL_EMPTY_Y ${ey}`);
  w(`#define CT_ATBSEL_EMPTY_W ${ew}`);
  w(`#define CT_ATBSEL_EMPTY_H ${eh}`);
  w();
  w('static const uint8_t ctAtbSelEmpty[CT_ATBSEL_EMPTY_H][CT_ATBSEL_EMPTY_W] = {');
  for (let j = 0; j < eh; j += 1) w(`  {${(empty[j] as (number | undefined)[]).map(pyStr).join(',')}},`);
  w('};');
  return o.join('');
};

export { emitTypewriter };
