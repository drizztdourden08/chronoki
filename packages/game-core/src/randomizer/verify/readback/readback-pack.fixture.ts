/* @layer bridge-wasm @kind fixture */
import { applySeedToPack } from '../../apply/apply-seed-to-pack';
import { planPackPlacement } from '../../apply/plan-pack-placement';
import { spliceFixture } from '../../apply/script/script-splice.fixture';
import { INTRO_JUMP } from '../../apply/start-state/start-block.constants';
import { planStartState } from '../../apply/start-state/plan-start-state';
import { STANDARD_START } from '../../apply/start-state/standard-start.constants';
import { deriveChestChecks } from '../../checks/derive-chest-checks';
import { deriveGiftChecks } from '../../checks/derive-gift-checks';
import type { CtPlacement } from '../../world/ct-placement.type';
import { placementFixture } from '../../world/ct-placement.fixture';
import type { PackBlob } from './readback-pack.type';

const { POKE, RETURN, buildScript, le16, le32 } = spliceFixture;

const buildPack = (blobs: PackBlob[]): Uint8Array => {
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((b) => {
    bytes.push(...le32(b.type), ...le32(b.id), ...le32(at), ...le32(b.data.length));
    at += b.data.length;
  });
  blobs.forEach((b) => bytes.push(...b.data));
  return Uint8Array.from(bytes);
};

const giftScript = (): number[] => [1, ...le16(32), ...le16(36), ...new Array<number>(28).fill(0), 0xca, 0x0b, 0x00, 0x00];

const vanillaPack = (): Uint8Array => {
  const pointers: number[] = [];
  for (let i = 0; i < 513; i += 1) pointers.push(...le16(i <= 5 ? 0x100 : 0x108));
  const records = [...le16(0x0403), ...le16(0x0a), ...le16(0x0505), ...le16(0x0020)];
  const gift = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0, 0, 0];
  const start = [0, 0, 0, 0, 0, 0, 0, 0, ...le16(9), 0, 0];
  return buildPack([
    { type: 37, id: 0x35f000, data: pointers },
    { type: 37, id: 0x350100, data: records },
    { type: 3, id: 0x12, data: gift },
    { type: 16, id: 7, data: giftScript() },
    { type: 36, id: 0x400000, data: [...new Array<number>(12).fill(0), ...giftScript()] },
    { type: 3, id: 0, data: start },
    { type: 16, id: 9, data: buildScript([[...POKE, ...INTRO_JUMP, ...RETURN]]) },
  ]);
};

const fixturePlacement = (): CtPlacement =>
  placementFixture([['chest-005-0', 'treasure-42'], ['chest-005-1', 'treasure-21'], ['gift-012-o0', 'treasure-77']]);

const writtenPack = (): Uint8Array => {
  const pack = vanillaPack();
  const checks = [...deriveChestChecks(pack), ...deriveGiftChecks(pack)];
  const result = applySeedToPack(pack, planPackPlacement(fixturePlacement(), checks).pack, [planStartState(STANDARD_START)]);
  if (!result.ok) throw new Error(`fixture pack refused: ${result.failed.join(', ')}`);
  return result.bytes;
};

const readbackFixture = { fixturePlacement, writtenPack };

export { readbackFixture };
