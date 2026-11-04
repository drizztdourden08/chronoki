/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peekOracle, recipeState } from '../oracle/peek-access';
import { chromeText } from './menu-chrome/chrome-text';
import type { GenFiles } from './oracle-gen-stage';
import { cgramOf } from './shared/fb-decode';
import { hexN } from './shared/py-format';

const TMW = 32;
const TMH = 28;
const BASE = 0x6000;
const OPEN_X = '0:20,200:2,0:60';

const tilemap = (vram: Uint8Array): number[] =>
  Array.from({ length: TMW * TMH }, (_, i) => (vram[BASE * 2 + i * 2] as number) | ((vram[BASE * 2 + i * 2 + 1] as number) << 8));

const need = (cond: boolean, what: string): void => {
  if (!cond) throw new Error(`menu_chrome: REFUSING -- ${what}`);
};

const ribbon = (n: number): string => `0:20${',80:2,0:8'.repeat(n)},0:40`;

/** tools/gen/menu_chrome.py: the X menu's BG2 chrome (tiles, palettes, every screen's tilemap) as src/data/menu_chrome.h (CRLF). */
const genMenuChrome = async (ctx: ImportContext): Promise<GenFiles> => {
  const oracle = peekOracle(ctx);
  const S = {
    menu: await recipeState(ctx, 'menu_open_gato2'),
    form: await recipeState(ctx, 'grupo_3_mapa'),
    save: await recipeState(ctx, 'ow_w0'),
    eqlist: await recipeState(ctx, 'menu_equip_spare'),
    exch: await recipeState(ctx, 'gato_wait'),
  };
  const cap = async (key: keyof typeof S, script: string, env?: Record<string, string>) => {
    const d = await oracle.peek({ state: S[key], script, env, rule: true });
    return { vram: d.vram, w: d.wram, cg: cgramOf(d.oam) };
  };
  const rib: number[][] = [];
  const ent: number[][] = [];
  let vram0: Uint8Array = new Uint8Array(0);
  let cg0: Uint8Array = new Uint8Array(0);
  for (let n = 0; n < 6; n += 1) {
    const { vram, w, cg } = await cap('menu', ribbon(n));
    need(w[0x67] === 0, `the ribbon view ${n} is not the main menu ($0067 = ${hexN(w[0x67] as number, 2)})`);
    if (n === 0) {
      vram0 = vram;
      cg0 = cg;
    }
    rib.push(tilemap(vram));
  }
  for (let n = 0; n < 4; n += 1) {
    const { vram, w } = await cap('menu', `${ribbon(n)},100:2,0:150`);
    need(w[0x67] === n + 1, `option ${n} did not enter its screen ($0067 = ${hexN(w[0x67] as number, 2)})`);
    ent.push(tilemap(vram));
  }
  const form = await cap('form', `${OPEN_X}${',80:2,0:4'.repeat(3)},80:2,0:8,100:2,0:150`);
  need(form.w[0x67] === 5, `the Form screen did not open ($0067 = ${hexN(form.w[0x67] as number, 2)}; C2/C627 wants two unlocked members)`);
  ent.push(tilemap(form.vram));
  const save = await cap('save', `${OPEN_X}${',80:2,0:4'.repeat(4)},80:2,0:8,100:2,0:150`);
  need(save.w[0x67] === 6, `the Save screen did not open ($0067 = ${hexN(save.w[0x67] as number, 2)}; C2/CEDC wants the overworld or a save point)`);
  ent.push(tilemap(save.vram));
  const equip = await cap('menu', '100:2,0:10,100:2,0:50');
  need(
    equip.w[0x67] === 1 && equip.w[0xbe] === 2,
    `not the Equip detail ($0067 = ${hexN(equip.w[0x67] as number, 2)}, $00BE = ${hexN(equip.w[0xbe] as number, 2)})`,
  );
  const eqlist = await cap('eqlist', `${OPEN_X},100:2,0:40,100:2,0:60,20:2,0:20,100:2,0:60`);
  need(eqlist.w[0x67] === 1 && eqlist.w[0xbe] === 3, `not the Equip candidate list ($00BE = ${eqlist.w[0xbe]})`);
  need(((eqlist.w[0x0fc6] as number) | 0) > 0, 'empty candidate list');
  const exch = await cap('exch', '0:20,2:4,0:96', { PEEK_POKE: '7F0000=49,2982=02,2983=03,0126=00' });
  need(
    exch.w[0x67] === 7 && exch.w[0x0a00] === 5,
    `the exchange screen did not open ($0067 = ${hexN(exch.w[0x67] as number, 2)}, $0A00 = ${hexN(exch.w[0x0a00] as number, 2)})`,
  );
  need(exch.w[0x0f0c] === 1, `no reserve member on the exchange screen ($0F0C = ${exch.w[0x0f0c]})`);
  const text = chromeText({
    cg0,
    vram0,
    rib,
    ent,
    eq: tilemap(equip.vram),
    eql: tilemap(eqlist.vram),
    exc: tilemap(exch.vram),
  });
  return { 'menu_chrome.h': text.replace(/\n/g, '\r\n') };
};

export { genMenuChrome };
