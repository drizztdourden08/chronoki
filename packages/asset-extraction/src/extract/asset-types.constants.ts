/* @layer shared-asset-extraction @kind constants */
const T_SCENE_PAL = 1;
const T_SPRITE_PAL = 2;
const T_SCENE_HDR = 3;
const T_PAL_ANIM = 4;
const T_TS12 = 5;
const T_TS3 = 6;
const T_MAP = 7;
const T_STRINGS = 8;
const T_DIALOGUE = 9;
const T_ACTORS = 10;
const T_COLLISION = 11;
const T_EXITS = 12;
const T_SPRITEANIM = 13;
const T_FONT = 14;
const T_SPRITE = 15;
const T_SCRIPT = 16;
const T_WORLD = 17;
const T_WORLDSPR = 18;
const T_WINDOW = 19;
const T_MOVER = 20;
const T_PORTRAIT = 22;
const T_NAMESPRITES = 23;
const T_MENUFONT = 24;
const T_NAMEWIN = 25;
const T_NAMEMSG = 26;
const T_WORLDINTROSEED = 27;
const T_SND_BOOT = 28;
const T_SND_SEQ = 29;
const T_SND_SAMPLE = 30;
const T_SND_INSTR = 31;
const T_SND_SONG = 32;
const T_SND_SFXSET = 33;
const T_SND_MISC = 34;
const T_SND_TIMING = 35;
const T_LZ = 36;
const T_TABLE = 37;

const S_DICT = 0;
const S_ITEMS = 1;
const S_WORLD = 2;
const S_LOCATIONS = 3;

const SCENE_HDR = 0x360000;
const SCENE_TS = 0x361c00;
const SCENE_PAL = 0x3624c0;
const MAP_PTRS = 0x361e00;
const TS_PTRS = 0x362220;
const ASM_PTRS = 0x362100;
const ASM3_PTRS = 0x3621c0;
const BANK_FF = 0x3f0000;

export {
  ASM3_PTRS,
  ASM_PTRS,
  BANK_FF,
  MAP_PTRS,
  SCENE_HDR,
  SCENE_PAL,
  SCENE_TS,
  S_DICT,
  S_ITEMS,
  S_LOCATIONS,
  S_WORLD,
  TS_PTRS,
  T_ACTORS,
  T_COLLISION,
  T_DIALOGUE,
  T_EXITS,
  T_FONT,
  T_LZ,
  T_MAP,
  T_MENUFONT,
  T_MOVER,
  T_NAMEMSG,
  T_NAMESPRITES,
  T_NAMEWIN,
  T_PAL_ANIM,
  T_PORTRAIT,
  T_SCENE_HDR,
  T_SCENE_PAL,
  T_SCRIPT,
  T_SND_BOOT,
  T_SND_INSTR,
  T_SND_MISC,
  T_SND_SAMPLE,
  T_SND_SEQ,
  T_SND_SFXSET,
  T_SND_SONG,
  T_SND_TIMING,
  T_SPRITE,
  T_SPRITEANIM,
  T_SPRITE_PAL,
  T_STRINGS,
  T_TABLE,
  T_TS12,
  T_TS3,
  T_WINDOW,
  T_WORLD,
  T_WORLDINTROSEED,
  T_WORLDSPR,
};
