/* @layer shared-asset-extraction @kind logic */
import { CAPTURE_RUNNERS } from '../captures/capture-runners.constants';
import type { StageRun } from '../pipeline/stage.type';
import { writeText } from '../pipeline/write-text';
import { requireBytes } from '../pipeline/require-bytes';
import { genAnimengPc } from './animeng-pc';
import { genBattleHudChrome } from './battle-hud-chrome';
import { genMenuDesc } from './menu-desc';
import { genMenuEquip } from './menu-equip';
import { genMenuTechrom } from './menu-techrom';
import { steamMarginsStage } from '../steam/steam-stage';

const decoder = new TextDecoder();

const dataFile = (name: string): string => `src/data/${name}`;

const romTextStage =
  (file: string, gen: (rom: Uint8Array) => string): StageRun =>
  async (ctx) => {
    await writeText(ctx.work, dataFile(file), gen(ctx.rom));
  };

/** animeng_pc.py writes three headers. */
const animengPcStage: StageRun = async (ctx) => {
  for (const [name, text] of Object.entries(genAnimengPc(ctx.rom))) await writeText(ctx.work, dataFile(name), text);
};

/** battle_hud_chrome.py reads the headers of battle_hud and battle_hud_sub (earlier stages) from the workdir. */
const battleHudChromeStage: StageRun = async (ctx) => {
  const hud = decoder.decode(await requireBytes(ctx.work, dataFile('battle_hud.h')));
  const hudSub = decoder.decode(await requireBytes(ctx.work, dataFile('battle_hud_sub.h')));
  await writeText(ctx.work, dataFile('battle_hud_chrome.h'), genBattleHudChrome(ctx.rom, hud, hudSub));
};

/** The generators of the second half of P4 that read the ROM (and, for the chrome, two earlier headers). */
const ROM_GEN_RUNNERS: Record<string, StageRun> = {
  menu_desc: romTextStage('menu_desc.h', genMenuDesc),
  menu_equip: romTextStage('menu_equip.h', genMenuEquip),
  menu_techrom: romTextStage('menu_techrom.h', genMenuTechrom),
  animeng_pc: animengPcStage,
  'steam-margins': steamMarginsStage,
  battle_hud_chrome: battleHudChromeStage,
  ...CAPTURE_RUNNERS,
};

export { ROM_GEN_RUNNERS };
