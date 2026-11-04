/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { cgWord, x5 } from './ctgen/menugfx';
import { crlf, hx } from './ctgen/text-file';
import { iconBlock } from './menu-loader-icon-block';
import { numeralBlock } from './menu-loader-numeral-block';
import { toneBlock } from './menu-loader-tone-block';
import type { LoaderCapture } from './menu-loader-capture.type';
import { captureLoader } from './menu-loader-capture';
import { stringBlock } from './menu-loader-strings';
import { HEADER } from './menu-loader.constants';

const tilemapBlock = (cells: number[]): string => {
  let s = '';
  for (let r = 0; r < 64; r += 1) {
    s += `  ${Array.from({ length: 32 }, (_, c) => `0x${hx(cells[r * 32 + c] as number, 4)},`).join(' ')}\n`;
  }
  return `${s}};\n\n`;
};

const bandBlock = (bands: [number, number][]): string => {
  let s =
    "// The BG2VOFS ($2110) HDMA bands, read out of the oracle's own table at $7E:9080:\n" +
    `//   ${bands.map(([c, v]) => `${c} lines @ 0x${hx(v, 4)}`).join(' | ')}\n` +
    '// The map line a scanline shows is (y + vofs) & 0x1FF over the 32x64 map above.\n' +
    `#define CT_MENU_LOADER_NBAND ${bands.length}\n` +
    'static const struct { short y0, y1; unsigned short vofs; }\n' +
    'ctMenuLoaderBand[CT_MENU_LOADER_NBAND] = {\n';
  let y0 = 0;
  for (const [c, v] of bands) {
    s += `  { ${String(y0).padStart(3)}, ${String(y0 + c - 1).padStart(3)}, 0x${hx(v, 4)} },\n`;
    y0 += c;
  }
  return `${s}};\n\n`;
};

const palBlock = (cg: Uint8Array): string => {
  let s = 'static const uint8_t ctMenuChromeLoaderPal[8][16][3] = {\n';
  for (let row = 0; row < 8; row += 1) {
    const cells = Array.from({ length: 16 }, (_, i) => {
      const w = cgWord(cg, row * 16 + i);
      return `{${x5(w & 31)},${x5((w >> 5) & 31)},${x5((w >> 10) & 31)}}`;
    });
    s += `  {${cells.join(',')}},\n`;
  }
  return `${s}};\n\n`;
};

const render = (c: LoaderCapture, rom: Uint8Array): string =>
  HEADER +
  tilemapBlock(c.cells) +
  bandBlock(c.bands) +
  palBlock(c.cg) +
  iconBlock(rom) +
  toneBlock(c.cg) +
  numeralBlock(c.vram, c.cg) +
  stringBlock(rom);

const genMenuLoader = async (ctx: ImportContext): Promise<string> => crlf(render(await captureLoader(ctx), ctx.rom));

export { genMenuLoader };
