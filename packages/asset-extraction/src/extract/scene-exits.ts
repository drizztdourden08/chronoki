/* @layer shared-asset-extraction @kind logic @source Python maps.scene_exits */
import { byteAt, wordAt } from './bytes/byte-reader';
import { EXITS_BASE } from './scene-exits.constants';
import type { SceneExit } from './scene-exits.type';

const sceneExits = (rom: Uint8Array, scene: number): SceneExit[] => {
  const addr = EXITS_BASE + wordAt(rom, EXITS_BASE + scene * 2);
  const nxt = scene < 511 ? EXITS_BASE + wordAt(rom, EXITS_BASE + (scene + 1) * 2) : 0x251a44;
  const exits: SceneExit[] = [];
  let o = addr;
  const count = Math.max(0, Math.floor((nxt - addr) / 7));
  for (let k = 0; k < count; k += 1) {
    const ex = byteAt(rom, o) * 16;
    const ey = byteAt(rom, o + 1) * 16;
    const sb = byteAt(rom, o + 2);
    const dif = byteAt(rom, o + 3) | (byteAt(rom, o + 4) << 8);
    const tx = byteAt(rom, o + 5);
    const ty = byteAt(rom, o + 6);
    o += 7;
    const side = ((sb & 0x7f) + 1) * 16;
    const size: [number, number] = sb & 0x80 ? [16, side] : [side, 16];
    const dest = dif & 0x1ff;
    const facing = (dif & 0x600) >> 9;
    const shx = dif & 0x800 ? -8 : 0;
    const shy = dif & 0x1000 ? -8 : 0;
    if (dest >= 0x1f0 && dest <= 0x1ff) {
      exits.push({ pos: [ex, ey], size, kind: 'world', dest: dest - 0x1f0, dpos: [tx * 8 + shx, ty * 8 + shy], facing });
    } else {
      exits.push({ pos: [ex, ey], size, kind: 'scene', dest, dpos: [tx * 16 + 8 + shx, ty * 16 + 15 + shy], facing });
    }
  }
  return exits;
};

export { sceneExits };
export type { SceneExit };
