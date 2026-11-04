/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../pipeline/import-context.type';
import { peek } from './ctgen/peek';
import { cgramOf } from './ctgen/cgram-of';
import { recipeState } from './ctgen/recipe-state';
import { hx } from './ctgen/hx';

const TMW = 32;
const TMH = 28;
const BASE = 0x6000;

interface ChromeCaptures {
  /** The ribbon view per option (Right x n). */
  ribbon: number[][];
  /** The entered screen per option. */
  entered: number[][];
  equip: number[];
  equipList: number[];
  exchange: number[];
  /** VRAM and CGRAM of the menu open with the ribbon on opt0. */
  vram0: Uint8Array;
  cg0: Uint8Array;
}

interface Cap {
  vram: Uint8Array;
  wram: Uint8Array;
  cg: Uint8Array;
}

/** The ribbon on option n: Right x n. */
const ribbon = (n: number): string => `0:20${',80:2,0:8'.repeat(n)},0:40`;
/** From the field: X opens the menu. */
const OPEN_X = '0:20,200:2,0:60';

const need = (cond: boolean, what: string): void => {
  if (!cond) throw new Error(`menu_chrome: REFUSING -- ${what}`);
};

const tilemap = (vram: Uint8Array): number[] =>
  Array.from({ length: TMW * TMH }, (_, i) => (vram[BASE * 2 + i * 2] as number) | ((vram[BASE * 2 + i * 2 + 1] as number) << 8));

/** The five start states: menu_open_gato2, grupo_3_mapa (Form), ow_w0 (Save), menu_equip_spare, gato_wait (exchange). */
const captureChrome = async (ctx: ImportContext): Promise<ChromeCaptures> => {
  const menu = await recipeState(ctx, 'menu_open_gato2');
  const form = await recipeState(ctx, 'grupo_3_mapa');
  const save = await recipeState(ctx, 'ow_w0');
  const eqlist = await recipeState(ctx, 'menu_equip_spare');
  const exch = await recipeState(ctx, 'gato_wait');
  const cap = async (state: Uint8Array, script: string, env?: Record<string, string>): Promise<Cap> => {
    const out = await peek(ctx, state, script, { env });
    return { vram: out.vram, wram: out.wram, cg: cgramOf(out) };
  };
  const w67 = (c: Cap): number => c.wram[0x67] as number;

  const rib: number[][] = [];
  let first: Cap | null = null;
  for (let n = 0; n < 6; n += 1) {
    const c = await cap(menu, ribbon(n));
    need(w67(c) === 0, `the ribbon view ${n} is not the main menu ($0067 = ${hx(w67(c), 2)})`);
    first ??= c;
    rib.push(tilemap(c.vram));
  }
  const ent: number[][] = [];
  for (let n = 0; n < 4; n += 1) {
    const c = await cap(menu, `${ribbon(n)},100:2,0:150`);
    need(w67(c) === n + 1, `option ${n} did not enter its screen ($0067 = ${hx(w67(c), 2)})`);
    ent.push(tilemap(c.vram));
  }
  const formCap = await cap(form, `${OPEN_X}${',80:2,0:4'.repeat(3)},80:2,0:8,100:2,0:150`);
  need(w67(formCap) === 5, `the Form screen did not open ($0067 = ${hx(w67(formCap), 2)}; C2/C627 wants two unlocked members)`);
  ent.push(tilemap(formCap.vram));
  const saveCap = await cap(save, `${OPEN_X}${',80:2,0:4'.repeat(4)},80:2,0:8,100:2,0:150`);
  need(w67(saveCap) === 6, `the Save screen did not open ($0067 = ${hx(w67(saveCap), 2)}; C2/CEDC wants the overworld or a save point)`);
  ent.push(tilemap(saveCap.vram));

  const eq = await cap(menu, '100:2,0:10,100:2,0:50');
  need(w67(eq) === 1 && eq.wram[0xbe] === 2, `not the Equip detail ($0067 = ${hx(w67(eq), 2)}, $00BE = ${hx(eq.wram[0xbe] as number, 2)})`);
  const el = await cap(eqlist, `${OPEN_X},100:2,0:40,100:2,0:60,20:2,0:20,100:2,0:60`);
  need(w67(el) === 1 && el.wram[0xbe] === 3, `not the Equip candidate list ($00BE = ${el.wram[0xbe]})`);
  need(((el.wram[0x0fc6] as number) | 0) > 0, 'empty candidate list');
  // Screen $07 (C2/C7A6): Y on the field (C0/1985 -> C0/19CE), the picker settled (P = f86, the fade-in done by f95).
  const ex = await cap(exch, '0:20,2:4,0:96', { PEEK_POKE: '7F0000=49,2982=02,2983=03,0126=00' });
  need(w67(ex) === 7 && ex.wram[0x0a00] === 5, `the exchange screen did not open ($0067 = ${hx(w67(ex), 2)}, $0A00 = ${hx(ex.wram[0x0a00] as number, 2)})`);
  need(ex.wram[0x0f0c] === 1, `no reserve member on the exchange screen ($0F0C = ${ex.wram[0x0f0c]})`);

  const f = first as Cap;
  return {
    ribbon: rib,
    entered: ent,
    equip: tilemap(eq.vram),
    equipList: tilemap(el.vram),
    exchange: tilemap(ex.vram),
    vram0: f.vram,
    cg0: f.cg,
  };
};

export { TMH, TMW, captureChrome };
export type { ChromeCaptures };
