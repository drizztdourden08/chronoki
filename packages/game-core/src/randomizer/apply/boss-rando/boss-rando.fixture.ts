/* @layer bridge-wasm @kind fixture */
import { ENEMY_COUNT, REWARDS_RECORD_BYTES, REWARDS_ROM, STATS_RECORD_BYTES, STATS_ROM } from '../enemy-table/enemy-table.constants';
import { BOSS_RANDO_SPOTS } from './boss-spots.constants';

type Blob = { type: number; id: number; data: number[] };

const le16 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff];
const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const slotOf = (index: number): number => (index % 2 === 0 ? 3 + index : 0x80 | (3 + index));
const levelOf = (index: number): number => 10 + index * 3;
const hpOf = (index: number): number => 1000 * (index + 1);

const sceneScript = (enemy: number, slot: number): number[] => [1, ...le16(32), ...new Array<number>(30).fill(0), 0x83, enemy, slot, 0x00];

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

export { hpOf, levelOf, sceneScript, slotOf, syntheticBossPack };
