/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { chunks, crlf, hx } from './ctgen/text-file';
import { captureTitle } from './title-intro-capture';
import type { TitleCapture } from './title-intro.type';

const CELLS = [0x08, 0x11, 0x13, 0x15, 0x17, 0x44, 0x5a, 0x5c, 0x5e, 0x60, 0x62, 0x64, 0x66, 0x68, 0x6c, 0x6e, 0x70, 0x72, 0xfe];

type Fmt = (v: number) => string;
const dec: Fmt = (v) => `${v}`;
const hex = (digits: number): Fmt => (v) => `0x${hx(v, digits)}`;

/** Python's emit(): one `static const` array, rows of `per`, each row ending in a comma. */
const emit = (name: string, vals: number[], per: number, fmt: Fmt = dec): string =>
  `static const ${name}[${vals.length}] = {\n${chunks(vals, per)
    .map((r) => `  ${r.map(fmt).join(',')},\n`)
    .join('')}};\n`;

const u16 = (b: Uint8Array, a: number): number => (b[a] as number) | ((b[a + 1] as number) << 8);
const words = (b: Uint8Array, at: number, n: number): number[] => Array.from({ length: n }, (_, i) => u16(b, at + i * 2));

const mode7Part = (c: TitleCapture): string => {
  const { nt, box, tmap, chr8 } = c;
  const chr = Array.from({ length: nt * 64 }, (_, i) => chr8[i] as number);
  const map: number[] = [];
  for (let r = box.r0; r < box.r0 + box.h; r += 1) {
    for (let col = box.c0; col < box.c0 + box.w; col += 1) map.push(tmap[r * 128 + col] as number);
  }
  return (
    '// ---- the MODE-7 texture (the pendulum swing) -------------------------------------\n' +
    `#define CT_TITLE_M7_TILES ${nt}\n#define CT_TITLE_M7_MAP_R0 ${box.r0}\n#define CT_TITLE_M7_MAP_C0 ${box.c0}\n` +
    `#define CT_TITLE_M7_MAP_W ${box.w}\n#define CT_TITLE_M7_MAP_H ${box.h}\n\n` +
    `// The mode-7 CHARACTERS: ${nt} tiles, 8x8 8bpp (the HIGH byte of VRAM words 0..${nt * 64 - 1}).\n` +
    emit('unsigned char ctTitleM7Chr', chr, 64) +
    '\n// The mode-7 TILEMAP, cropped to its non-zero bounding box (the field is 128x128).\n' +
    emit('unsigned char ctTitleM7Map', map, box.w) +
    '#define CT_TITLE_M7_X 32\n#define CT_TITLE_M7_Y -64\n'
  );
};

const mode2Part = (c: TitleCapture): string =>
  '\n// ---- the MODE-2 VRAM window: OBJ chr $4000, BG chr $5000, BG2 map $6000, BG1 map\n' +
  '// $6400. Captured whole and addressed exactly as the PPU addresses it, so the render\n' +
  "// is LakeSnes' own fetch (snes/ppu.c) rather than a re-decoding of the tiles.\n" +
  `#define CT_TITLE_VRAM_BASE 0x${hx(c.vbase, 4)}\n#define CT_TITLE_VRAM_WORDS 0x${hx(c.vwords, 4)}\n` +
  emit('unsigned short ctTitleVram', Array.from({ length: c.vwords }, (_, i) => c.w(c.vbase + i)), 16, hex(4));

const dataPart = (c: TitleCapture): string => {
  const s = c.seed;
  const list = (from: number, to: number): number[] => Array.from(s.subarray(from, to));
  return (
    "\n// ---- the overlay's own DATA -------------------------------------------------------\n" +
    '// The SEQUENCE SCRIPT: the byte-code the $C3 interpreter (C3/0B03) runs with DP = $0A00.\n' +
    `#define CT_TITLE_SCRIPT_BASE 0x${hx(c.scriptBase, 4)}\n` +
    emit('unsigned char ctTitleScript', list(c.scriptBase, c.scriptEnd), 16, hex(2)) +
    '\n// The eleven SPRITE PACKAGES: [count+1][tile, attr, dx, dy] x n, as C3/0D0E reads them.\n' +
    `#define CT_TITLE_PKG_BASE 0x${hx(c.pkgBase, 4)}\n` +
    emit('unsigned char ctTitlePkg', list(c.pkgBase, c.pkgEnd), 16, hex(2)) +
    '\n// The five CHRONO letters the task $7E:5D71 slides: package pointer + speed (1/16 px).\n' +
    emit('unsigned short ctTitleSlidePkg', c.slidePkg, 5, hex(4)) +
    emit('unsigned short ctTitleSlideSpd', words(s, 0x5d67, 5), 5) +
    '\n// ---- the PALETTE ------------------------------------------------------------------\n' +
    '// $7E:2000 is the base the palette jobs blend FROM; $7E:2200 is the shadow the vblank\n' +
    '// hook $7E:388B DMAs into CGRAM every frame. Raw 5-5-5, expanded on the way out.\n' +
    emit('unsigned short ctTitlePal0', words(s, 0x2000, 256), 16, hex(4))
  );
};

const seedPart = (c: TitleCapture): string => {
  const s = c.seed;
  const b = (a: number): string => hx(s[a] as number, 2);
  return (
    `\n// ---- the SEED: the machine's WRAM at oracle boot frame ${c.seedFrame} --------------------------\n` +
    emit('unsigned short ctTitleSeedReg', words(s, 0xa00, 16), 8, hex(4)) +
    emit('unsigned short ctTitleSeedCtr', words(s, 0xa22, 16), 8, hex(4)) +
    `#define CT_TITLE_SEED_IP  0x${hx(u16(s, 0xa20), 4)}\n#define CT_TITLE_SEED_RET 0x${hx(u16(s, 0xa30), 4)}\n` +
    emit('unsigned short ctTitleSeedTask', words(s, 0x920, 16), 8, hex(4)) +
    emit('unsigned short ctTitleSeedVbl', words(s, 0x940, 8), 8, hex(4)) +
    `#define CT_TITLE_SEED_SNDBUSY 0x${b(0x388)}\n#define CT_TITLE_SEED_SNDCUR  0x${b(0x389)}\n#define CT_TITLE_SEED_SNDREQ  0x${b(0x38a)}\n` +
    `#define CT_TITLE_SEED_BRI    0x${b(0x38d)}\n#define CT_TITLE_SEED_BRIPER 0x${b(0x38e)}\n#define CT_TITLE_SEED_BRICNT 0x${b(0x38f)}\n` +
    "// The overlay's live cells, in the order src/title_intro.c names them.\n" +
    emit('unsigned short ctTitleSeedCell', CELLS.map((a) => u16(s, a)), 8, hex(4)) +
    emit('unsigned short ctTitleSeedSlide', words(s, 0x46, 5), 5, hex(4)) +
    emit('unsigned short ctTitleSeedTgt', words(s, 0x50, 5), 5, hex(4)) +
    emit('unsigned short ctTitleSeedWave', words(s, 0xc00, 64), 16, hex(4)) +
    '// The OAM shadow $7E:0700 (512 sprite bytes + the 32-byte high table).\n' +
    emit('unsigned char ctTitleSeedOam', Array.from(s.subarray(0x700, 0x920)), 16, hex(2)) +
    '// $7E:00F0..$00F9 -- the multiply/divide scratch. ⭐ $F8 is NOT dead: bit 7 of it is\n' +
    '// the carry $31BF rotates into its middle ADC, so the seed has to carry it.\n' +
    emit('unsigned char ctTitleSeedScratch', Array.from(s.subarray(0xf0, 0xfa)), 10, hex(2)) +
    emit('unsigned short ctTitleSeedPalShadow', words(s, 0x2200, 256), 16, hex(4))
  );
};

const sinePart = (c: TitleCapture): string =>
  "\n// ---- the ROM's own SINE TABLE, $C0:F900 (1024 bytes, a full circle = 0x400) -------\n" +
  '// $7E:3465 (sine) = `AND #$03FF / TAX / LDA $C0F900,X / AND #$00FF`, NEGATED for X < $200,\n' +
  "// and its `CPX #$0200` leaves the CARRY the callers' next ADC picks up.\n" +
  '// $7E:3461 (cosine) = the same entry with `CLC / ADC #$0100` in front.\n' +
  emit('unsigned char ctTitleSin', Array.from(c.sin), 32);

const HEAD =
  "// title_intro.h - what the TITLE SEQUENCE's engine runs on (disasm/notes/title_intro.md).\n" +
  "// GENERATED by tools/gen/title_intro.py from the oracle's own VRAM/WRAM and the ROM's own\n" +
  '// sine table. DO NOT EDIT.\n//\n' +
  "// The port RUNS the overlay's machine rather than baking its output, so this file holds\n" +
  '// only what a machine cannot compute: the graphics the boot load built, the overlay\'s own\n' +
  '// byte-code and package tables, the seed state, and $C0:F900.\n\n';

/** tools/gen/title_intro.py: the data the title sequence's engine runs on (Python's default text mode: CRLF). */
const genTitleIntro = async (ctx: ImportContext): Promise<string> => {
  const c = await captureTitle(ctx);
  return crlf(HEAD + mode7Part(c) + mode2Part(c) + dataPart(c) + seedPart(c) + sinePart(c));
};

export { genTitleIntro };
