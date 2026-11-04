/* @layer shared-asset-extraction @kind logic */
import { hx } from './ctgen/hx';

const PUNCT: Record<number, string> = {
  0xde: '!',
  0xdf: '?',
  0xe0: '/',
  0xe1: '"',
  0xe2: '"',
  0xe3: ':',
  0xe4: '&',
  0xe5: '(',
  0xe6: ')',
  0xe7: "'",
  0xe8: '.',
  0xe9: ',',
  0xea: '=',
  0xeb: '-',
  0xec: '+',
  0xed: '%',
  0xef: ' ',
  0xf3: '#',
};

const cstr = (rom: Uint8Array, ptr: number): number[] => {
  const out: number[] = [];
  for (let o = 0x3f0000 | ptr; rom[o]; o += 1) out.push(rom[o] as number);
  return out;
};

/**
 * assets/text.py parse_character, verbatim for the printable subset. Leading spaces are kept (the ROM does not centre
 * these strings); only the tail is stripped.
 */
const mapped = (bytes: number[]): string =>
  bytes
    .map((c) => {
      if (c >= 0xa0 && c <= 0xb9) return String.fromCharCode(65 + c - 0xa0);
      if (c >= 0xba && c <= 0xd3) return String.fromCharCode(97 + c - 0xba);
      if (c >= 0xd4 && c <= 0xdd) return String.fromCharCode(48 + c - 0xd4);
      return PUNCT[c] ?? ' ';
    })
    .join('')
    .trimEnd();

const word = (rom: Uint8Array, at: number): number => (rom[at] as number) | ((rom[at + 1] as number) << 8);

const strings = (rom: Uint8Array, table: number, n: number): string =>
  Array.from({ length: n }, (_, k) => `  "${mapped(cstr(rom, word(rom, table + 2 * k))).replaceAll('"', '\\"')}",\n`).join('');

/** The two ROM string tables the screen shows (chapter titles, era names) and the tables that pick them. */
const stringBlock = (rom: Uint8Array): string => {
  const thr = Array.from(rom.subarray(0x3fd024, 0x3fd024 + 26), (b) => `0x${hx(b, 2)}`).join(', ');
  const eraNib = Array.from({ length: 512 }, (_, loc) => {
    const b = rom[0x3fd296 + (loc >> 1)] as number;
    return loc & 1 ? b >> 4 : b & 0x0f;
  });
  let s =
    '// C2/D266-D288, the SAVE-SLOT CHAPTER TITLE.  The slot\'s storyline byte (slot+0x0603 =\n' +
    '// the first byte of record 4, $7F:0000) is walked DOWN the 26-entry threshold table at\n' +
    '// $FF:D024 (`LDX #1A / DEX / CMP $FFD024,X / BCC`), and the surviving X indexes the\n' +
    '// 27-pointer string table at $FF:D03E (C2/D2A0 `LDX #D03E / STX $020D`; index 26 = the\n' +
    '// EMPTY-slot arm C2/D28D `LDA #1A`).\n' +
    '#define CT_LOADER_CHAPTERS 27\n' +
    `static const uint8_t ctLoaderChapThr[26] = { ${thr} };\n`;
  s += 'static const char* const ctLoaderChapter[CT_LOADER_CHAPTERS] = {\n';
  s += `${strings(rom, 0x3fd03e, 27)}};\n\n`;
  s +=
    '// C2/D3AD-D3DC, the ERA name.  `LDA $98C2 / LSR A / TAX / LDA $FFD296,X` then, when the\n' +
    '// location id was ODD (the carry the LSR left), four more LSRs -- i.e. ONE NIBBLE PER\n' +
    '// LOCATION in the table at $FF:D296, low nibble first -- and the nibble indexes the\n' +
    '// 8-pointer string table at $FF:D396 (C2/D3D4 `LDX #D396 / STX $020D`).\n' +
    'static const uint8_t ctLoaderEraOf[512] = {\n';
  for (let r = 0; r < 512; r += 16) s += `  ${eraNib.slice(r, r + 16).map((v) => `${v},`).join(' ')}\n`;
  s += '};\n';
  s += 'static const char* const ctLoaderEra[8] = {\n';
  s += `${strings(rom, 0x3fd396, 8)}};\n#endif\n`;
  return s;
};

export { stringBlock };
