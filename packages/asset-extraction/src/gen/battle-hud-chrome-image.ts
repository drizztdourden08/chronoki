/* @layer shared-asset-extraction @kind logic */
import { romRegion } from '../rom/hirom';

/** battle_hud_chrome.py chrome(): C1/1C3A + C1/081E, the $0B40 tilemap image for the enqueued seats `queue` (3 booleans). */
const chromeImage = (rom: Uint8Array, queue: boolean[]): Uint8Array => {
  const b = romRegion(rom, 0x115800, 0x115800 + 0x180);
  const fr = romRegion(rom, 0x1159fc, 0x1159fc + 6 * 14);
  for (let s = 0; s < 3; s += 1) {
    if (!queue[s]) continue;
    const skip = s > 0 && queue[s - 1] ? 1 : 0;
    const dst = 12 * s + 2 * skip;
    for (let r = 0; r < 6; r += 1) b.set(fr.subarray(r * 14 + 2 * skip, r * 14 + 14), r * 0x40 + dst);
  }
  return b;
};

/** battle_hud_chrome.py word(): the tilemap word at row r, column c. */
const tileWord = (b: Uint8Array, r: number, c: number): number =>
  (b[r * 0x40 + c * 2] as number) | ((b[r * 0x40 + c * 2 + 1] as number) << 8);

/** battle_hud_chrome.py bake(): the 48x256 pixel table `name` of a generated C header's text. */
const parseBake = (text: string, name: string): number[][] => {
  const i = text.indexOf(`${name}[48][256] = {`);
  if (i < 0) throw new Error(`${name}[48][256] is not in the header`);
  const j = text.indexOf('};', i);
  const nums = (text.slice(text.indexOf('{', i) + 1, j).match(/\d+/g) ?? []).map(Number);
  if (nums.length !== 48 * 256) throw new Error(`${name}: ${nums.length} numbers, not ${48 * 256}`);
  return Array.from({ length: 48 }, (_, k) => nums.slice(k * 256, (k + 1) * 256));
};

export { chromeImage, parseBake, tileWord };
