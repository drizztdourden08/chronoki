/* @layer shared-asset-extraction @kind logic */
const STR_TBL = 0xffcf3b - 0xc00000;
const WIDTH_TBL = 0xc260e6 - 0xc00000;
const INDENT = 8;
const TEXT_X = 32;

const penRows = (rom: Uint8Array): number[][][] => {
  const out: number[][][] = [];
  for (const row of [0, 1]) {
    const at = STR_TBL + (row + 1) * 2;
    const off = (rom[at] as number) | ((rom[at + 1] as number) << 8);
    let a = 0xff0000 + off - 0xc00000;
    const chars: number[] = [];
    while (rom[a] !== 0x00) {
      chars.push(rom[a] as number);
      a += 1;
    }
    const lines: number[][] = [[]];
    for (const c of chars) {
      if (c === 0x05) lines.push([]);
      else (lines[lines.length - 1] as number[]).push(c);
    }
    out.push(
      lines.map((ln) => {
        let pen = INDENT;
        const pens: number[] = [];
        ln.forEach((c, k) => {
          pen += rom[WIDTH_TBL + (c - 0xa0)] as number;
          if (k % 2 === 1 || k === ln.length - 1) pens.push(pen);
        });
        return pens;
      }),
    );
  }
  return out;
};

const pyStr = (v: number | undefined): string => (v === undefined ? 'None' : String(v));

const emitTypewriter = (
  pens: number[][][],
  empty: (number | undefined)[][],
  ex: number,
  ey: number,
  ew: number,
  eh: number,
): string => {
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

export { TEXT_X, emitTypewriter, penRows };
