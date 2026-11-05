/* @layer bridge-wasm @kind fixture */
import { ENEMY_COUNT, REWARDS_RECORD_BYTES, REWARDS_ROM, STATS_RECORD_BYTES, STATS_ROM } from '../enemy-table/enemy-table.constants';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';
import type { Blob } from './boss-rando.fixture.type';
import { hpOf } from './hp-of.fixture';
import { le16 } from './le16.fixture';
import { le32 } from './le32.fixture';
import { levelOf } from './level-of.fixture';
import { sceneScript } from './scene-script.fixture';
import { slotOf } from './slot-of.fixture';

const sceneBlobs = (scene: number, script: number): Blob[] => [
  { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(script), 0, 0] },
];

const tableBlobs = (): Blob[] => {
  const stats = new Array<number>(ENEMY_COUNT * STATS_RECORD_BYTES).fill(0);
  const rewards = new Array<number>(ENEMY_COUNT * REWARDS_RECORD_BYTES).fill(0);
  BOSS_RANDO_SPOTS.forEach((spot, i) => {
    const s = spot.enemy * STATS_RECORD_BYTES;
    stats.splice(s, 3, ...le16(hpOf(i)), levelOf(i));
    stats[s + 10] = 10 + i;
    stats[s + 14] = 20 + i * 4;
    stats[s + 15] = 40 + i;
    const r = spot.enemy * REWARDS_RECORD_BYTES;
    rewards.splice(r, 4, ...le16(100 * (i + 1)), ...le16(50 * (i + 1)));
    rewards[r + 6] = i + 1;
  });
  return [{ type: 37, id: STATS_ROM, data: stats }, { type: 37, id: REWARDS_ROM, data: rewards }];
};

const packOf = (blobs: Blob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const syntheticBossPack = (overrides: Readonly<Record<number, number[]>> = {}): Uint8Array => {
  let script = 0x100;
  const blobs = BOSS_RANDO_SPOTS.flatMap((spot, i) =>
    spot.scenes.flatMap((scene): Blob[] => {
      script += 1;
      return [...sceneBlobs(scene, script), { type: 16, id: script, data: overrides[scene] ?? sceneScript(spot.enemy, slotOf(i)) }];
    }));
  return packOf([...blobs, ...tableBlobs()]);
};

export { syntheticBossPack };
