/* @layer shared-asset-extraction @kind logic */
import type { SpriteUsage } from './extract.type';
import { extractActors } from './script/extract-actors';
import type { Actor } from './script/script-run.type';
import { loadScript } from './script/script-load';
import { opLen } from './script/script-oplen';

/** Sweeps one scene's whole body for 0xAC operands and script-loaded sprites (ops 0x80-0x83); a failure ends the sweep. */
const sweepBody = (rom: Uint8Array, scene: number, sprites: Set<number>, usage: SpriteUsage): void => {
  try {
    const h = rom.slice(0x360000 + scene * 14, 0x360000 + scene * 14 + 14);
    const { body } = loadScript(rom, (h[8] as number) | ((h[9] as number) << 8));
    let o = 0;
    while (o < body.length - 1) {
      const ln = opLen(body, o);
      if (ln <= 0) break;
      const op = body[o] as number;
      const arg = body[o + 1] as number;
      if (op === 0xac) {
        for (const sp of sprites) usage.staticMax.set(sp, Math.max(usage.staticMax.get(sp) ?? 0, arg));
      } else if (op >= 0x80 && op <= 0x83) {
        const sp = arg + (op === 0x82 ? 7 : op === 0x83 ? 256 : 0);
        usage.usedSprites.add(sp);
        sprites.add(sp);
      }
      o += ln;
    }
  } catch {
    // Python: `except Exception: pass`
  }
};

/** extract_assets.build() prelude: sprites referenced by placed actors or loaded by scripts, and each sprite's max 0xAC frame. */
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
