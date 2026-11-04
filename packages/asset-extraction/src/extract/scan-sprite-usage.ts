/* @layer shared-asset-extraction @kind logic @source Python extract_assets.build */
import type { SpriteUsage } from './extract.type';
import { extractActors } from './script/extract-actors';
import type { Actor } from './script/script-run.type';
import { loadScript } from './script/script-load';
import { opLen } from './script/script-oplen';

const loaderOffset = (op: number): number => {
  if (op === 0x82) return 7;
  if (op === 0x83) return 256;
  return 0;
};

const noteOp = (op: number, arg: number, sprites: Set<number>, usage: SpriteUsage): void => {
  if (op === 0xac) {
    for (const sp of sprites) usage.staticMax.set(sp, Math.max(usage.staticMax.get(sp) ?? 0, arg));
  } else if (op >= 0x80 && op <= 0x83) {
    const sp = arg + loaderOffset(op);
    usage.usedSprites.add(sp);
    sprites.add(sp);
  }
};

const sweepOps = (body: Uint8Array, sprites: Set<number>, usage: SpriteUsage): void => {
  let o = 0;
  while (o < body.length - 1) {
    const ln = opLen(body, o);
    if (ln <= 0) break;
    noteOp(body[o] as number, body[o + 1] as number, sprites, usage);
    o += ln;
  }
};

const sweepBody = (rom: Uint8Array, scene: number, sprites: Set<number>, usage: SpriteUsage): boolean => {
  try {
    const h = rom.slice(0x360000 + scene * 14, 0x360000 + scene * 14 + 14);
    const { body } = loadScript(rom, (h[8] as number) | ((h[9] as number) << 8));
    sweepOps(body, sprites, usage);
    return true;
  } catch {
    return false;
  }
};

const scanSpriteUsage = (rom: Uint8Array): SpriteUsage => {
  const usage: SpriteUsage = { usedSprites: new Set(), staticMax: new Map() };
  for (let s = 0; s < 512; s += 1) {
    let actors: Actor[];
    try {
      actors = extractActors(rom, s).actors;
    } catch {
      continue;
    }
    const sprites = new Set<number>();
    for (const a of actors) {
      if (a.visible && a.sprite !== null && a.pos !== null) {
        usage.usedSprites.add(a.sprite);
        sprites.add(a.sprite);
      }
    }
    sweepBody(rom, s, sprites, usage);
  }
  return usage;
};

export { scanSpriteUsage };
