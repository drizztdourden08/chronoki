/* @layer shared-asset-extraction @kind logic */
import { STR_TBL, INDENT, WIDTH_TBL } from './typewriter.constants';

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

export { penRows };
